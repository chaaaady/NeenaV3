import { NextResponse } from "next/server";
import { spawn } from "node:child_process";

type Prayer = { adhan?: string; iqama?: string; wait?: number };
type Timings = {
  Imsak?: Prayer;
  Fajr?: Prayer;
  Sunrise?: Prayer;
  Dhuhr?: Prayer;
  Asr?: Prayer;
  Maghrib?: Prayer;
  Isha?: Prayer;
  Jumua?: Prayer;
};

// In-memory cache for the whole day. Refreshed once per date (server local time)
const CACHE: Record<string, { at: number; dayKey: string; data: Timings }> = {};

function getDayKeyLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const TIME_RE = /\b([01]?\d|2[0-3]):([0-5]\d)\b/gi;
const WAIT_RE = /\+(\d{1,2})\b/i; // +5, +10, +15, etc.

function normalizeHtml(input: string): string {
  // Normalize to NFKC, replace NBSP/zero-width with spaces, collapse spaces
  let s = input.normalize?.("NFKC") ?? input;
  s = s.replace(/[\u00A0\u2000-\u200D\uFEFF]/g, " ");
  // unify Arabic punctuation variants of apostrophes
  s = s.replace(/[’‘`´]/g, "'");
  return s;
}

function parseTimesBlock(block: string): Prayer {
  let adhan: string | undefined;
  let iqama: string | undefined;
  let wait: number | undefined;

  const mWait = block.match(WAIT_RE);
  if (mWait) wait = parseInt(mWait[1], 10);

  const times = [...block.matchAll(TIME_RE)].map((m) => `${m[1].padStart(2, "0")}:${m[2]}`);
  if (times.length > 0) {
    adhan = times[0];
    if (times.length > 1) {
      iqama = times[1];
      if (wait == null) {
        try {
          const [ah, am] = adhan.split(":").map((x) => parseInt(x, 10));
          const [ih, im] = iqama.split(":").map((x) => parseInt(x, 10));
          const a = new Date(); a.setHours(ah, am, 0, 0);
          const i = new Date(); i.setHours(ih, im, 0, 0);
          if (i < a) i.setDate(i.getDate() + 1);
          wait = Math.floor((i.getTime() - a.getTime()) / 60000);
        } catch {}
      }
    }
  }
  if (!iqama && wait != null && adhan) {
    try {
      const [ah, am] = adhan.split(":").map((x) => parseInt(x, 10));
      const a = new Date(); a.setHours(ah, am, 0, 0);
      const i = new Date(a.getTime() + wait * 60000);
      iqama = `${String(i.getHours()).padStart(2, "0")}:${String(i.getMinutes()).padStart(2, "0")}`;
    } catch {}
  }
  return { adhan, iqama, wait };
}

function toFlat(timings: Timings): Record<string, string> {
  const flat: Record<string, string> = {};
  const keys: Array<keyof Timings> = [
    "Imsak",
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
    "Jumua",
  ];
  for (const k of keys) {
    const v = timings[k];
    if (v && (v.adhan || v.iqama)) {
      flat[String(k)] = (v.adhan || v.iqama) as string;
    }
  }
  return flat;
}

type ValidationIssue = { field: string; message: string };
function validateTimingsFlat(flat: Record<string, string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const need = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (const k of need) {
    if (!flat[k]) issues.push({ field: k, message: `${k} manquant` });
  }
  const re = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  for (const [k, v] of Object.entries(flat)) {
    if (v && !re.test(v)) {
      issues.push({ field: k, message: `format invalide: ${v}` });
    }
  }
  // Vérif ordre croissant approximatif dans la journée
  const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const toMinutes = (s?: string) => {
    if (!s) return null;
    const [h, m] = s.split(":").map((x) => parseInt(x, 10));
    return h * 60 + m;
  };
  let prev: number | null = null;
  for (const k of order) {
    const t = toMinutes(flat[k]);
    if (t == null) continue;
    if (prev != null && t < prev) {
      issues.push({ field: k, message: `${k} avant précédent` });
    }
    prev = t;
  }
  return issues;
}

function extractBlock(html: string, labelPatterns: string[], dbg?: Record<string, string>): string | undefined {
  const cleaned = normalizeHtml(html).replace(/[\t ]+/g, " ");

  // 1) Try proximity with "Adhan" (but optional — we don't bail if missing)
  for (const lp of labelPatterns) {
    const reAdhan = new RegExp(`${lp}[\\s\\S]{0,600}?Adhan[\\s\\S]{0,400}?(?:${TIME_RE.source})`, "i");
    const mA = cleaned.match(reAdhan);
    if (mA) {
      const idx = mA.index ?? 0;
      const snip = cleaned.slice(idx, Math.min(idx + 1500, cleaned.length));
      if (dbg) dbg[`block:${lp}:adhan`] = snip;
      return snip;
    }
  }

  // 2) Fallback: large slice after label
  for (const lp of labelPatterns) {
    const re = new RegExp(`${lp}(.{0,1500})`, "i");
    const m = cleaned.match(re);
    if (m) {
      const snip = `${lp} ${m[1]}`;
      if (dbg) dbg[`block:${lp}:slice`] = snip;
      return snip;
    }
  }

  // 3) Fallback line-by-line: take up to 6 following lines
  const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    for (const lp of labelPatterns) {
      const re = new RegExp(`\\b${lp}\\b`, "i");
      if (re.test(lines[i])) {
        const snip = [lines[i], lines[i + 1] || "", lines[i + 2] || "", lines[i + 3] || "", lines[i + 4] || "", lines[i + 5] || ""].join(" ");
        if (dbg) dbg[`block:${lp}:lines`] = snip;
        return snip;
      }
    }
  }
  return undefined;
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return await res.text();
}

function getDetailed(html: string, labels: string[], dbg?: Record<string, string>): Prayer | undefined {
  const block = extractBlock(html, labels, dbg);
  if (!block) return undefined;
  const parsed = parseTimesBlock(block);
  if (parsed.adhan || parsed.iqama || parsed.wait != null) return parsed;
  return undefined;
}

function scrapeFromHtml(html: string, dbg?: Record<string, string>): Timings {
  const timings: Timings = {
    Imsak:   getDetailed(html, ["Imsak", "Imsâk", "إمساك"], dbg),
    Fajr:    getDetailed(html, ["Fajr", "الفجر"], dbg),
    Sunrise: getDetailed(html, ["Chourouk", "Chorouq", "Chorouk", "Shourouk", "Sunrise", "الشروق"], dbg),
    Dhuhr:   getDetailed(html, ["Dhuhr", "Dohr", "Duhur", "Zuhr", "Dohor", "الظهر"], dbg),
    Asr:     getDetailed(html, ["Asr", "العصر"], dbg),
    Maghrib: getDetailed(html, ["Maghrib", "Maghreb", "المغرب"], dbg),
    Isha:    getDetailed(html, ["Isha", "Ishaa", "العشاء", "عشاء"], dbg),
    Jumua:   getDetailed(html, ["Jumua", "Jumu’", "Jumu'u", "Jumu’a", "Jumu'a", "Vendredi", "الجمعة"], dbg),
  };
  return timings;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "mosquee-sahaba-creteil").trim();
  const directUrl = searchParams.get("url");
  const debug = searchParams.get("debug") === "1" || searchParams.get("debug") === "true";
  const mode = searchParams.get("mode") || "playwright";
  const base = directUrl ?? `https://mawaqit.net/fr/${slug}`;
  const embed = directUrl
    ? `${directUrl}${directUrl.includes("?") ? "&" : "?"}showOnlyTimes=true&embed=true`
    : `${base}?showOnlyTimes=true&embed=true`;
  const mobile = directUrl ? directUrl : `https://mawaqit.net/fr/m/${slug.replace(/^m\//, "")}`;

  // Cache
  const key = directUrl ? `url:${directUrl}` : `slug:${slug}`;
  const now = Date.now();
  const dayKey = getDayKeyLocal();
  const cached = CACHE[key];
  if (!debug && cached && cached.dayKey === dayKey) {
    const flat = toFlat(cached.data);
    const issues = validateTimingsFlat(flat);
    return NextResponse.json({ ok: true, timings: cached.data, flat, issues, cached: true });
  }

  const dbg: Record<string, string> = {};
  let used = "embed";

  try {
    // If explicitly requested, use the local Python Playwright scraper (executes JS, more reliable)
    if (mode === "playwright") {
      const py = await runPythonScraper(base);
      // Expect JSON with keys Fajr/Sunrise/Dhuhr/Jumua/Asr/Maghrib/Isha (adhan/iqama/wait)
      const timings: Timings = {
        Fajr: py.Fajr,
        Sunrise: py.Sunrise,
        Dhuhr: py.Dhuhr,
        Jumua: py.Jumua,
        Asr: py.Asr,
        Maghrib: py.Maghrib,
        Isha: py.Isha,
      };
      CACHE[key] = { at: now, dayKey, data: timings };
      const flat = toFlat(timings);
      const issues = validateTimingsFlat(flat);
      return NextResponse.json({ ok: true, used: "playwright", timings, flat, issues, cached: false });
    }
    // 1) embed (souvent statique), 2) base, 3) mobile
    let html = await fetchHtml(embed);
    let timings = scrapeFromHtml(html, dbg);
    let count = Object.values(timings).filter(Boolean).length;

    if (count < 4) {
      used = "base";
      html = await fetchHtml(base);
      timings = scrapeFromHtml(html, dbg);
      count = Object.values(timings).filter(Boolean).length;
    }

    if (count < 4 && mobile !== base) {
      used = "mobile";
      html = await fetchHtml(mobile);
      timings = scrapeFromHtml(html, dbg);
      count = Object.values(timings).filter(Boolean).length;
    }

    CACHE[key] = { at: now, dayKey, data: timings };

    const flat = toFlat(timings);
    const issues = validateTimingsFlat(flat);
    if (debug) {
      return NextResponse.json({ ok: true, used, count, timings, flat, issues, debug: dbg, cached: false });
    }
    return NextResponse.json({ ok: true, used, timings, flat, issues, cached: false });
  } catch (_e) {
    // Fallback to HTML scraping if playwright path fails
    try {
      const base = directUrl ?? `https://mawaqit.net/fr/${slug}`;
      const embed = directUrl
        ? `${directUrl}${directUrl.includes("?") ? "&" : "?"}showOnlyTimes=true&embed=true`
        : `${base}?showOnlyTimes=true&embed=true`;
      const mobile = directUrl ? directUrl : `https://mawaqit.net/fr/m/${slug.replace(/^m\//, "")}`;
      const dbg: Record<string, string> = {};
      let used = "embed";
      let html = await fetchHtml(embed);
      let timings = scrapeFromHtml(html, dbg);
      let count = Object.values(timings).filter(Boolean).length;
      if (count < 4) {
        used = "base";
        html = await fetchHtml(base);
        timings = scrapeFromHtml(html, dbg);
        count = Object.values(timings).filter(Boolean).length;
      }
      if (count < 4 && mobile !== base) {
        used = "mobile";
        html = await fetchHtml(mobile);
        timings = scrapeFromHtml(html, dbg);
      }
      CACHE[key] = { at: now, dayKey, data: timings };
      const flat = toFlat(timings);
      const issues = validateTimingsFlat(flat);
      return NextResponse.json({ ok: true, used, timings, flat, issues, cached: false });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch or parse page" },
        { status: 500 }
      );
    }
  }
}

function runPythonScraper(targetUrl?: string): Promise<Record<string, Prayer>> {
  const args = ["scrape_prayer_times.py", ...(targetUrl ? [targetUrl] : [])];
  const trySpawn = (cmd: string) =>
    new Promise<Record<string, Prayer>>((resolve, reject) => {
      const p = spawn(cmd, args, { cwd: process.cwd() });
      let out = "";
      let err = "";
      p.stdout.on("data", (d) => (out += d.toString()));
      p.stderr.on("data", (d) => (err += d.toString()));
      p.on("error", (er) => reject(er));
      p.on("close", (code) => {
        if (code !== 0) return reject(new Error(err || `${cmd} exited ${code}`));
        try {
          const json = JSON.parse(out);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });

  // Prefer python3, then fallback to python
  return trySpawn("python3").catch((_e) => {
    // If python3 not found, try python
    return trySpawn("python");
  });
}

