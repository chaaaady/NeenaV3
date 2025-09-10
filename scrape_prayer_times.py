# scrape_prayer_times.py
# Usage: python scrape_prayer_times.py
# Output: JSON imprimé en console avec adhan, iqama (si dispo) et wait_minutes (si "+N" ou calculable)

import json
import re
import requests
from bs4 import BeautifulSoup

TARGETS = [
    "https://mawaqit.net/fr/mosquee-sahaba-creteil",        # page demandée
    "https://mawaqit.net/fr/m/mosquee-sahaba-creteil",      # fallback mobile (souvent plus "scrapable")
]

def extract_from_html(html_content):
    """
    Extrait les horaires depuis le HTML en cherchant la variable confData
    """
    results = {}
    
    # Chercher la variable confData dans le HTML
    conf_data_match = re.search(r'var\s+confData\s*=\s*({.*?});', html_content, re.DOTALL)
    if conf_data_match:
        try:
            conf_data_str = conf_data_match.group(1)
            # Nettoyer le JSON (supprimer les commentaires et caractères invalides)
            conf_data_str = re.sub(r'//.*?\n', '\n', conf_data_str)
            conf_data_str = re.sub(r'/\*.*?\*/', '', conf_data_str, flags=re.DOTALL)
            
            conf_data = json.loads(conf_data_str)
            
            # Mapping des indices du tableau times
            # times = [Fajr, Dhuhr, Asr, Maghrib, Isha]
            if 'times' in conf_data and len(conf_data['times']) >= 5:
                # Récupérer les wait_minutes depuis iqamaCalendar
                wait_times = None
                if 'iqamaCalendar' in conf_data and len(conf_data['iqamaCalendar']) > 0:
                    # Prendre le premier mois (mois actuel)
                    current_month = conf_data['iqamaCalendar'][0]
                    if len(current_month) > 0:
                        # Prendre le premier jour du mois
                        first_day = current_month['1']
                        if len(first_day) >= 5:  # [Fajr, Dhuhr, Asr, Maghrib, Isha]
                            wait_times = first_day
                
                # Valeurs par défaut si pas de wait_times
                if not wait_times:
                    wait_times = [10, 10, 10, 5, 5]  # [Fajr, Dhuhr, Asr, Maghrib, Isha]
                
                results["Fajr"] = {
                    "adhan": conf_data['times'][0],
                    "iqama": calculate_iqama(conf_data['times'][0], wait_times[0]),
                    "wait_minutes": wait_times[0]
                }
                
                results["Dhuhr"] = {
                    "adhan": conf_data['times'][1],
                    "iqama": calculate_iqama(conf_data['times'][1], wait_times[1]),
                    "wait_minutes": wait_times[1]
                }
                
                results["Asr"] = {
                    "adhan": conf_data['times'][2],
                    "iqama": calculate_iqama(conf_data['times'][2], wait_times[2]),
                    "wait_minutes": wait_times[2]
                }
                
                results["Maghrib"] = {
                    "adhan": conf_data['times'][3],
                    "iqama": calculate_iqama(conf_data['times'][3], wait_times[3]),
                    "wait_minutes": wait_times[3]
                }
                
                results["Isha"] = {
                    "adhan": conf_data['times'][4],
                    "iqama": calculate_iqama(conf_data['times'][4], wait_times[4]),
                    "wait_minutes": wait_times[4]
                }
            
            # Ajouter Sunrise/Chourouk
            if 'shuruq' in conf_data:
                results["Sunrise"] = {
                    "adhan": conf_data['shuruq'],
                    "iqama": None,
                    "wait_minutes": None
                }
            
            # Ajouter Jumua
            if 'jumua' in conf_data:
                results["Jumua"] = {
                    "adhan": conf_data['jumua'],
                    "iqama": calculate_iqama(conf_data['jumua'], 10),  # Wait par défaut pour Jumua
                    "wait_minutes": 10
                }
                
        except Exception as e:
            print(f"Failed to parse confData: {e}")
    
    return results

def calculate_iqama(adhan_time, wait_minutes):
    """
    Calcule l'iqama en ajoutant wait_minutes à adhan_time
    """
    if not adhan_time or not wait_minutes:
        return None
    
    try:
        # Parser l'heure adhan (format HH:MM)
        hours, minutes = map(int, adhan_time.split(':'))
        
        # Convertir wait_minutes en nombre entier (gérer le format "+10")
        if isinstance(wait_minutes, str):
            wait_minutes = int(wait_minutes.replace('+', ''))
        else:
            wait_minutes = int(wait_minutes)
        
        # Ajouter les minutes d'attente
        total_minutes = hours * 60 + minutes + wait_minutes
        
        # Convertir en heures et minutes
        new_hours = total_minutes // 60
        new_minutes = total_minutes % 60
        
        # Formater en HH:MM
        return f"{new_hours:02d}:{new_minutes:02d}"
        
    except Exception:
        return None

def scrape():
    aggregate = {}
    
    for url in TARGETS:
        try:
            # Supprimer le print de debug
            # print(f"Trying URL: {url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            html_content = response.text
            partial = extract_from_html(html_content)
            
            if partial:
                aggregate.update(partial)
                # Supprimer le print de debug
                # print(f"Successfully extracted from {url}")
                
                # Si on a les prières essentielles, on peut s'arrêter
                REQUIRED = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
                if all(p in aggregate for p in REQUIRED):
                    break
                    
        except Exception as e:
            # Supprimer le print de debug
            # print(f"Failed to scrape {url}: {e}")
            continue
    
    return aggregate

if __name__ == "__main__":
    data = scrape()
    print(json.dumps(data, ensure_ascii=False, indent=2))

