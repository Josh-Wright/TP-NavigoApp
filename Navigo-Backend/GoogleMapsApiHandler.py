import googlemaps
from datetime import datetime,timedelta
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
            departure_time=departure_time +timedelta(hours=12)
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
    def parse_route_steps(route_data):
      
        combined_steps = []
        
        # Check if route_data exists and has elements
        if not isinstance(route_data, list) or not route_data:
            return combined_steps
        
        step_counter = 1
        
        for route in route_data:
            for leg in route.get('legs', []):
                for step in leg.get('steps', []):
                    # Handle walking steps (including substeps)
                    if step.get('travel_mode') == 'WALKING':
                        if 'steps' in step:  # Parent step with substeps
                            for substep in step['steps']:
                                combined_steps.append({
                                    'step_number': step_counter,
                                    'type': 'walking',
                                    'instruction': substep.get('html_instructions', ''),
                                    'distance': substep['distance']['text'],
                                    'duration': substep['duration']['text'],
                                    'start_location': substep['start_location'],
                                    'end_location': substep['end_location'],
                                    'maneuver': substep.get('maneuver', ''),
                                    'polyline': substep.get('polyline', {}).get('points', '')
                                })
                                step_counter += 1
                        else:  # Direct walking step
                            combined_steps.append({
                                'step_number': step_counter,
                                'type': 'walking',
                                'instruction': step.get('html_instructions', ''),
                                'distance': step['distance']['text'],
                                'duration': step['duration']['text'],
                                'start_location': step['start_location'],
                                'end_location': step['end_location'],
                                'maneuver': step.get('maneuver', ''),
                                'polyline': step.get('polyline', {}).get('points', '')
                            })
                            step_counter += 1
                    
                    # Handle transit steps
                    elif step.get('travel_mode') == 'TRANSIT':
                        transit_details = step.get('transit_details', {})
                        line = transit_details.get('line', {})
                        
                        combined_steps.append({
                            'step_number': step_counter,
                            'type': 'transit',
                            'instruction': step.get('html_instructions', ''),
                            'distance': step['distance']['text'],
                            'duration': step['duration']['text'],
                            'departure_stop': transit_details.get('departure_stop', {}).get('name', ''),
                            'departure_time': transit_details.get('departure_time', {}).get('text', ''),
                            'arrival_stop': transit_details.get('arrival_stop', {}).get('name', ''),
                            'arrival_time': transit_details.get('arrival_time', {}).get('text', ''),
                            'line_operator': line.get('agencies', '')[0].get('name', ''),
                            'line_name': line.get('name', ''),
                            'line_short_name': line.get('short_name', ''),
                            'num_stops': transit_details.get('num_stops', 0),
                            'start_location': step['start_location'],
                            'end_location': step['end_location']
                        })
                        step_counter += 1
        
        return combined_steps
    @staticmethod
    def extract_transit_details(route_data):
   
   
        transit_details = []
        
        # Check if route_data exists and has raw_route
        if  not route_data:
            return transit_details
        
        for step in route_data:
            if step.get('type') == 'transit':
                transit_info = {
                    'step_number': step.get('step_number'),
                    'operator': step.get('line_operator', 'Unknown'),
                    'line_name': step.get('line_name', ''),
                    'line_short_name': step.get('line_short_name', ''),
                    'instruction': step.get('instruction', ''),
                    'distance': step.get('distance', ''),
                    'duration': step.get('duration', ''),
                    'departure_stop': step.get('departure_stop', ''),
                    'departure_time': step.get('departure_time', ''),
                    'arrival_stop': step.get('arrival_stop', ''),
                    'arrival_time': step.get('arrival_time', ''),
                    'num_stops': step.get('num_stops', 0),
                    'start_location': step.get('start_location', {}),
                    'end_location': step.get('end_location', {})
                }
                transit_details.append(transit_info)
        
        return transit_details


# if __name__ == "__main__":
#     # Example usage
#     maps = GoogleMapsHandler()
    
# #     # Geocoding example
# #     geocode_result = maps.geocode_address('1600 Amphitheatre Parkway, Mountain View, CA')
# #     print("Geocode Result:", geocode_result)
    
# #     # Reverse geocoding 
# #     reverse_geocode_result = maps.reverse_geocode(40.714224, -73.961452)
# #     print("Reverse Geocode Result:", reverse_geocode_result)
    
# #     # Directions 
#     directions_result = maps.get_directions(
#         origin="de22 3fy",
#         destination="Queens Medical Centre, Nottingham",
#         mode="transit"
#     )
    
#     parsed_directions = maps.parse_directions(directions_result)
#     print("Parsed Directions:", json.dumps(directions_result, indent=4))