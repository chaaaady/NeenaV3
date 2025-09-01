# scrape_prayer_times.py
# Usage: python scrape_mawaqit.py
# Output: JSON imprimé en console avec adhan, iqama (si dispo) et wait_minutes (si "+N" ou calculable)

import json
import re
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright

TARGETS = [
    "https://mawaqit.net/fr/mosquee-sahaba-creteil",        # page demandée
    "https://mawaqit.net/fr/m/mosquee-sahaba-creteil",      # fallback mobile (souvent plus “scrapable”)
]

PRAYER_LABELS = {
    "Fajr": ["Fajr", "الفجر"],
    "Sunrise": ["Chourouk", "Chorouq", "Chorouk", "Shourouk", "Sunrise", "الشروق"],
    "Dhuhr": ["Dhuhr", "Dohr", "Duhur", "Zuhr", "Dohor", "الظهر"],
    "Asr": ["Asr", "العصر"],
    "Maghrib": ["Maghrib", "Maghreb", "المغرب"],
    "Isha": ["Isha", "Ishaa", "العشاء", "عشاء"],
    "Jumua": ["Jumua", "Jumu’", "Jumu'u", "Jumu’a", "Jumu'a", "Vendredi", "الجمعة"],
}

TIME_RE = re.compile(r"\b([01]?\d|2[0-3]):([0-5]\d)\b")
WAIT_RE = re.compile(r"\+(\d{1,2})\b")  # +10, +5, etc.


def _parse_times_block(block_text, prayer_name=None):
    """
    Extrait depuis un bloc de texte:
      - adhan: HH:MM (1er horaire)
      - iqama: HH:MM si un 2e horaire est présent
      - wait_minutes: si “+N” est trouvé OU calculé (iqama - adhan)
    """
    adhan = None
    iqama = None
    wait_minutes = None

    # Cherche un "+N"
    m_wait = WAIT_RE.search(block_text)
    if m_wait:
        wait_minutes = int(m_wait.group(1))

    # Récupère toutes les times HH:MM
    times = TIME_RE.findall(block_text)
    times = [f"{h.zfill(2)}:{m}" for h, m in times]

    # Filtrer par fenêtre plausible selon la prière
    if prayer_name:
        def to_min(s):
            hh, mm = s.split(":")
            return int(hh) * 60 + int(mm)

        # Fenêtres grossières (minutes depuis 00:00)
        WINDOWS = {
            "Fajr": (180, 480),       # 03:00 - 08:00
            "Sunrise": (300, 570),    # 05:00 - 09:30
            "Dhuhr": (660, 930),      # 11:00 - 15:30
            "Jumua": (660, 990),      # 11:00 - 16:30 (vendredi)
            "Asr": (840, 1170),       # 14:00 - 19:30
            "Maghrib": (1020, 1320),  # 17:00 - 22:00
            "Isha": (1140, 1560),     # 19:00 - 26:00 (02:00 next day)
        }
        start, end = WINDOWS.get(prayer_name, (0, 2000))
        filt = []
        for t in times:
            m = to_min(t)
            if start <= m <= end or (end > 1440 and (m + 1440) <= end):
                filt.append(t)
        if filt:
            times = filt

    if times:
        adhan = times[0]
        if len(times) >= 2:
            iqama = times[1]
            # Si pas de +N explicite, on calcule le delta (minutes) si plausible
            if wait_minutes is None:
                try:
                    ah = datetime.strptime(adhan, "%H:%M")
                    iq = datetime.strptime(iqama, "%H:%M")
                    # Si iqama est antérieure (cas rares de chevauchement), ajoute 24h
                    if iq < ah:
                        iq += timedelta(days=1)
                    wait_minutes = int((iq - ah).total_seconds() // 60)
                except Exception:
                    pass

    # Si pas d’iqama mais on a +N et adhan, on peut reconstruire iqama théorique
    if iqama is None and wait_minutes is not None and adhan:
        try:
            ah = datetime.strptime(adhan, "%H:%M")
            iq = (ah + timedelta(minutes=wait_minutes)).time()
            iqama = iq.strftime("%H:%M")
        except Exception:
            pass

    return {"adhan": adhan, "iqama": iqama, "wait_minutes": wait_minutes}


def extract_from_dom_text(dom_text):
    """
    Cherche pour chaque prière un segment de texte proche contenant les HH:MM et/ou +N.
    Stratégie simple et robuste: on prend une slice de texte après le mot-clé.
    """
    results = {}

    # Normaliser espaces
    text = re.sub(r"[ \t]+", " ", dom_text)
    # On travaille ligne à ligne pour limiter le bruit
    lines = [l.strip() for l in text.splitlines() if l.strip()]

    # Recompose un “voisinage” autour de chaque prière
    joined = "\n".join(lines)

    for p, labels in PRAYER_LABELS.items():
        # Construire une alternance sûre des labels
        alt = "|".join([re.escape(x) for x in labels])
        pattern = re.compile(rf"(?:{alt})\b(.{{0,160}})", re.IGNORECASE | re.DOTALL)
        m = pattern.search(joined)
        block = ""
        if m:
            block = f"{labels[0]} {m.group(1)}"
        else:
            # fallback: ligne par ligne, on prend la ligne où un des labels apparait et les 2 suivantes
            for i, l in enumerate(lines):
                if re.search(rf"\b(?:{alt})\b", l, re.IGNORECASE):
                    block = " ".join(lines[i:i+3])
                    break

        if block:
            parsed = _parse_times_block(block, p)
            # On ne retient que si au moins adhan ou iqama détecté
            if parsed["adhan"] or parsed["iqama"] or parsed["wait_minutes"] is not None:
                results[p] = parsed

    return results


def scrape():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page()
        aggregate = {}

        for url in TARGETS:
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            # Laisse du temps aux widgets/JS
            try:
                page.wait_for_load_state("networkidle", timeout=5000)
            except Exception:
                pass
            page.wait_for_timeout(1500)

            body_text = page.locator("body").inner_text()

            partial = extract_from_dom_text(body_text)
            aggregate.update({k: v for k, v in partial.items() if v})

            # Si on a les prières essentielles, on peut s’arrêter
            REQUIRED = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
            if all(p in aggregate for p in REQUIRED):
                break

        browser.close()

    # Ne renvoyer que les prières d'intérêt (incluant Sunrise si trouvé)
    order = ["Fajr", "Sunrise", "Dhuhr", "Jumua", "Asr", "Maghrib", "Isha"]
    ordered = {p: aggregate.get(p) for p in order}
    return ordered


if __name__ == "__main__":
    data = scrape()
    print(json.dumps(data, ensure_ascii=False, indent=2))

