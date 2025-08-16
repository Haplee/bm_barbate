import requests
from bs4 import BeautifulSoup
import json

# A list of dictionaries, where each dictionary represents a team.
TEAMS_URLS = [
    {
        "category_slug": "alevin-femenino",
        "category_name": "Alevin femenino",
        "url": "https://www.rfebm.com/competiciones/equipo_playa.php?id_equipo=214313&id=1031518"
    },
    {
        "category_slug": "infantil-femenino-1",
        "category_name": "Infantil femenino 1",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=214230&id=1031556"
    },
    {
        "category_slug": "infantil-femenino-2",
        "category_name": "infantil femenino 2",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=217922&id=1031558"
    },
    {
        "category_slug": "infantil-masculino-1",
        "category_name": "infantil maculino 1",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=221095&id=1031549"
    },
    {
        "category_slug": "infantil-masculino-2",
        "category_name": "infantil masculino 2",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=214229&id=1031550"
    },
    {
        "category_slug": "cadete-femenino-1",
        "category_name": "Cadete femenino 1",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=218765&id=1031467"
    },
    {
        "category_slug": "cadete-femenino-2",
        "category_name": "Cadete femenino 2",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=214228&id=1031544"
    },
    {
        "category_slug": "cadete-masculino",
        "category_name": "Cadete masculino",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=214227&id=1031468"
    },
    {
        "category_slug": "senior-femenino",
        "category_name": "Senior femenino",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=217656&id=1031790"
    },
    {
        "category_slug": "senior-masculino-1",
        "category_name": "senior masculino 1",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=214224&id=1031793"
    },
    {
        "category_slug": "senior-masculino-2",
        "category_name": "senior masculino 2",
        "url": "https://www.rfebm.com/competiciones/equipo.php?seleccion=0&id_equipo=214232&id=1031795"
    }
]

def scrape_team_data(url):
    """ Scrapes player and coach data from a given RFEBM team URL. """
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
        return None, None, None

    soup = BeautifulSoup(response.content, 'html.parser')
    team_name_tag = soup.find('h3', class_='centrado')
    team_name = team_name_tag.get_text(strip=True) if team_name_tag else "Unknown Team"

    plantilla_table = soup.find('table', class_='plantilla')
    if not plantilla_table:
        plantilla_header = soup.find('h3', string=lambda text: 'PLANTILLA' in text if text else False)
        if plantilla_header:
            plantilla_table = plantilla_header.find_next('table')

    if not plantilla_table:
        print(f"Could not find 'plantilla' table in {url}")
        return team_name, [], []

    players, coaches = [], []
    is_technical_staff = False
    for row in plantilla_table.find('tbody').find_all('tr'):
        header_cell = row.find('th')
        if header_cell and 'TÉCNICOS' in header_cell.get_text():
            is_technical_staff = True
            continue

        cells = row.find_all('td')
        if len(cells) >= 3:
            name = cells[1].get_text(strip=True)
            role = cells[2].get_text(strip=True)
            if is_technical_staff:
                coaches.append({'name': name, 'role': role})
            elif role.lower() == 'jugador':
                players.append({'name': name})

    return team_name, players, coaches

import os

def save_to_json(data, filename):
    """Saves the given data to a JSON file."""
    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"{filename} has been updated successfully.")


if __name__ == '__main__':
    all_teams_data = []
    all_staff_data = {}

    for team_info in TEAMS_URLS:
        print(f"Scraping {team_info['category_name']}...")
        team_name, players, coaches = scrape_team_data(team_info['url'])

        if team_name and (players or coaches):
            all_teams_data.append({
                'category_slug': team_info['category_slug'],
                'category_name': team_info['category_name'],
                'team_name': team_name,
                'players': players,
                'coaches': coaches
            })
            for coach in coaches:
                if coach['name'] not in all_staff_data:
                    all_staff_data[coach['name']] = {'roles': []}
                role_entry = f"{coach['role']} @ {team_name}"
                if role_entry not in all_staff_data[coach['name']]['roles']:
                    all_staff_data[coach['name']]['roles'].append(role_entry)

    print("\n--- Saving data to JSON files ---")
    save_to_json(all_teams_data, 'data/teams.json')
    save_to_json(all_staff_data, 'data/staff.json')
    print("\nJSON files update process complete.")
