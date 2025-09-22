import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

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
    if (!flat[k]) {
      // Cas spécial : si Dhuhr est manquant mais Jumua est présent, c'est OK
      if (k === "Dhuhr" && flat["Jumua"]) {
        continue; // Pas d'erreur si Jumua remplace Dhuhr
      }
      issues.push({ field: k, message: `${k} manquant` });
    }
  }
  
  const re = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  for (const [k, v] of Object.entries(flat)) {
    if (v && !re.test(v)) {
      issues.push({ field: k, message: `format invalide: ${v}` });
    }
  }
  
  // Vérif ordre croissant approximatif dans la journée
  // Remplacer Dhuhr par Jumua si nécessaire pour la validation
  const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const toMinutes = (s?: string) => {
    if (!s) return null;
    const [h, m] = s.split(":").map((x) => parseInt(x, 10));
    return h * 60 + m;
  };
  
  let prev: number | null = null;
  for (const k of order) {
    let t: number | null = null;
    
    if (k === "Dhuhr" && !flat[k] && flat["Jumua"]) {
      // Utiliser Jumua comme alternative à Dhuhr pour la validation
      t = toMinutes(flat["Jumua"]);
    } else {
      t = toMinutes(flat[k]);
    }
    
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
  const force = searchParams.get("force") === "1" || searchParams.get("force") === "true";
  const mode = searchParams.get("mode") || "html"; // Par défaut: scraping HTML compatible Vercel
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
  if (!debug && !force && cached && cached.dayKey === dayKey) {
    const flat = toFlat(cached.data);
    const issues = validateTimingsFlat(flat);
    return NextResponse.json({ ok: true, timings: cached.data, flat, issues, cached: true });
  }

  const dbg: Record<string, string> = {};
  let used = "embed";

  try {
    // If explicitly requested, use the local Python Playwright scraper (executes JS, more reliable)
    if (mode === "playwright") {
      console.warn("Using Python Playwright scraper...");
      try {
        const py = await runPythonScraper(base);
        console.warn("Python scraper result:", py);
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
        console.warn("Processed timings:", timings);
        CACHE[key] = { at: now, dayKey, data: timings };
        const flat = toFlat(timings);
        const issues = validateTimingsFlat(flat);
        return NextResponse.json({ ok: true, used: "playwright", timings, flat, issues, cached: false });
      } catch (pyError) {
        console.error("Python scraper failed:", pyError);
        // Fallback vers scraping HTML si Python n'est pas disponible (ex: Vercel)
        // Ne pas retourner ici: on laisse le flux continuer vers la partie HTML
      }
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
  } catch {
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
  console.warn("Running Python scraper with args:", args);
  console.warn("Current working directory:", process.cwd());
  console.warn("Script path:", path.join(process.cwd(), "scrape_prayer_times.py"));
  console.warn("PATH:", process.env.PATH);
  
  const trySpawn = (cmd: string) =>
    new Promise<Record<string, Prayer>>((resolve, reject) => {
      console.warn(`Trying to spawn: ${cmd}`);
      const p = spawn(cmd, args, { cwd: process.cwd() });
      let out = "";
      let err = "";
      
      p.stdout.on("data", (d) => {
        const data = d.toString();
        console.warn("Python stdout:", data);
        out += data;
      });
      
      p.stderr.on("data", (d) => {
        const data = d.toString();
        console.error("Python stderr:", data);
        err += data;
      });
      
      p.on("error", (er) => {
        console.error("Python spawn error:", er);
        reject(er);
      });
      
      p.on("close", (code) => {
        console.warn(`Python process closed with code: ${code}`);
        console.warn("Python output:", out);
        console.error("Python errors:", err);
        
        if (code !== 0) {
          const errorMsg = err || `${cmd} exited ${code}`;
          console.error("Python failed:", errorMsg);
          return reject(new Error(errorMsg));
        }
        
        try {
          const json = JSON.parse(out);
          console.warn("Successfully parsed Python output:", json);
          
          // Post-traitement pour gérer Dhuhr vs Jumua
          const processed = processPrayerTimes(json);
          
          resolve(processed);
        } catch (parseErr) {
          console.error("Failed to parse Python output:", parseErr);
          reject(parseErr);
        }
      });
    });

  // Use absolute path to python3
  return trySpawn("/Users/humanappeal/Desktop/NeenaV3-1/venv/bin/python3").catch((_e) => {
    console.warn("Virtual env python3 failed, trying absolute python3...");
    return trySpawn("/usr/bin/python3");
  });
}

/**
 * Post-traitement des horaires de prière pour gérer Dhuhr vs Jumua
 */
function processPrayerTimes(rawTimings: Record<string, Prayer>): Record<string, Prayer> {
  const processed = { ...rawTimings };
  
  // Vérifier si c'est le vendredi
  const today = new Date();
  const isFriday = today.getDay() === 5; // 0 = dimanche, 5 = vendredi
  
  if (isFriday && processed.Jumua && processed.Dhuhr) {
    // Le vendredi seulement, Jumua remplace Dhuhr
    // On supprime Dhuhr pour éviter la confusion
    delete processed.Dhuhr;
    console.warn("Vendredi détecté: Jumua priorisé, Dhuhr supprimé");
  } else {
    // Les autres jours, on garde Dhuhr ET Jumua
    // Même s'ils ont les mêmes horaires, c'est normal
    console.warn("Jour non-vendredi: Dhuhr et Jumua conservés (même si horaires identiques)");
  }
  
  return processed;
}

