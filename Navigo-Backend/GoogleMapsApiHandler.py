import googlemaps
from datetime import datetime
from dotenv import load_dotenv
import os
import json

# Load environment variables and initialize client
load_dotenv()
gmaps = googlemaps.Client(key=os.getenv("GMAPS_KEY"))

def geocode_address(address: str):
    
  
    return gmaps.geocode(address)

def reverse_geocode(lat: float, lng: float):
 
    return gmaps.reverse_geocode((lat, lng))

def get_directions(origin: str, destination: str, mode: str = "transit", departure_time: datetime = None):

    if departure_time is None:
        departure_time = datetime.now()
    return gmaps.directions(origin, destination, mode=mode, departure_time=departure_time)

def validate_address(address_lines: list, region_code: str = None, locality: str = None, enable_usps_cass: bool = False):
   
    return gmaps.addressvalidation(
        address_lines, 
        regionCode=region_code,
        locality=locality, 
        enableUspsCass=enable_usps_cass
    )



def parse_gmaps_directions(directions_data):
    
    if not directions_data:
        return {}
    
    first_leg = directions_data[0]['legs'][0]
    simplified = {
        'origin': {
            'address': first_leg['start_address'],
            'location': {
                'lat': first_leg['start_location']['lat'],
                'lng': first_leg['start_location']['lng']
            }
        },
        'destination': {
            'address': first_leg['end_address'],
            'location': {
                'lat': first_leg['end_location']['lat'],
                'lng': first_leg['end_location']['lng']
            }
        },
        'duration': first_leg['duration']['text'],
        'distance': first_leg['distance']['text'],
        'steps': []
    }
    
    for step in first_leg['steps']:
        simplified_step = {
            'instruction': step['html_instructions'],
            'distance': step['distance']['text'],
            'duration': step['duration']['text'],
            'travel_mode': step['travel_mode'].lower()
        }
        
        
        if step['travel_mode'] == 'TRANSIT':
            transit = step['transit_details']
            simplified_step['transit'] = {
                'line': {
                    'name': transit['line']['name'],
                    'short_name': transit['line']['short_name'],
                    'color': transit['line']['color'],
                    'vehicle': transit['line']['vehicle']['type'].lower()
                },
                'departure': {
                    'stop': transit['departure_stop']['name'],
                    'time': transit['departure_time']['text'],
                    'location': {
                        'lat': transit['departure_stop']['location']['lat'],
                        'lng': transit['departure_stop']['location']['lng']
                    }
                },
                'arrival': {
                    'stop': transit['arrival_stop']['name'],
                    'time': transit['arrival_time']['text'],
                    'location': {
                        'lat': transit['arrival_stop']['location']['lat'],
                        'lng': transit['arrival_stop']['location']['lng']
                    }
                },
                'num_stops': transit['num_stops'],
                'headsign': transit['headsign']
            }
        
        simplified['steps'].append(simplified_step)
    
    return simplified





if __name__ == "__main__":
    # Geocoding example
    geocode_result = geocode_address('1600 Amphitheatre Parkway, Mountain View, CA')
    # print("Geocode Result:", geocode_result)
    
    # Reverse geocoding 
    reverse_geocode_result = reverse_geocode(40.714224, -73.961452)
    # print("Reverse Geocode Result:", reverse_geocode_result)
    
    # Directions 
    directions_result = get_directions(
        origin="de22 3fy",
        destination="Queens Medical Centre, Nottingham",
        mode="transit"
    )
    print("Directions Result:", json.dumps(parse_gmaps_directions(directions_result),indent=4))
    
