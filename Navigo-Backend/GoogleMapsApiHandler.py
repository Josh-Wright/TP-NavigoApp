import googlemaps
from datetime import datetime
from dotenv import load_dotenv
import os
import json

class GoogleMapsHandler:
    def __init__(self, api_key=None):
       
        if api_key is None:
            load_dotenv()
            api_key = os.getenv("GMAPS_KEY")
        
       
            
        self.client = googlemaps.Client(key=api_key)

    def geocode_address(self, address: str):
      
        return self.client.geocode(address)

    def reverse_geocode(self, lat: float, lng: float):
       
        return self.client.reverse_geocode((lat, lng))

    def get_directions(self, origin: str, destination: str, mode: str = "transit", 
                      departure_time: datetime = None):
      
        if departure_time is None:
            departure_time = datetime.now()
            
        return self.client.directions(
            origin, 
            destination, 
            mode=mode, 
            departure_time=departure_time
        )

    def validate_address(self, address_lines: list, region_code: str = None, 
                         locality: str = None, enable_usps_cass: bool = False):
      
        return self.client.addressvalidation(
            address_lines, 
            regionCode=region_code,
            locality=locality, 
            enableUspsCass=enable_usps_cass
        )

    @staticmethod
    def parse_directions(directions_data):
       
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


# if __name__ == "__main__":
#     # Example usage
#     maps = GoogleMapsWrapper()
    
#     # Geocoding example
#     geocode_result = maps.geocode_address('1600 Amphitheatre Parkway, Mountain View, CA')
#     print("Geocode Result:", geocode_result)
    
#     # Reverse geocoding 
#     reverse_geocode_result = maps.reverse_geocode(40.714224, -73.961452)
#     print("Reverse Geocode Result:", reverse_geocode_result)
    
#     # Directions 
#     directions_result = maps.get_directions(
#         origin="de22 3fy",
#         destination="Queens Medical Centre, Nottingham",
#         mode="transit"
#     )
    
#     parsed_directions = maps.parse_directions(directions_result)
#     print("Parsed Directions:", json.dumps(parsed_directions, indent=4))