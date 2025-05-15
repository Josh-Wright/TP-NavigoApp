import os
import json
import xml.etree.ElementTree as ET
from collections import defaultdict

def parse_stop_info(xml_file):
    """Parse stop information from a TransXChange XML file"""
    namespaces = {
        'txc': 'http://www.transxchange.org.uk/',
        'xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    }
    
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    stops = []
    
    # Find all AnnotatedStopPointRef elements
    for stop_point in root.findall('.//txc:AnnotatedStopPointRef', namespaces):
        stop_info = {
            'StopPointRef': None,
            'CommonName': None,
            'Indicator': None,
            'Longitude': None,
            'Latitude': None
        }
        
        # Get basic stop info
        stop_point_ref = stop_point.find('txc:StopPointRef', namespaces)
        if stop_point_ref is not None:
            stop_info['StopPointRef'] = stop_point_ref.text
            
        common_name = stop_point.find('txc:CommonName', namespaces)
        if common_name is not None:
            stop_info['CommonName'] = common_name.text
            
        indicator = stop_point.find('txc:Indicator', namespaces)
        if indicator is not None:
            stop_info['Indicator'] = indicator.text
            
        # Get location info - can be in different formats
        location = stop_point.find('txc:Location', namespaces)
        if location is not None:
            # First format: Direct longitude/latitude
            longitude = location.find('txc:Longitude', namespaces)
            latitude = location.find('txc:Latitude', namespaces)
            if longitude is not None and latitude is not None:
                stop_info['Longitude'] = longitude.text
                stop_info['Latitude'] = latitude.text
            else:
                # Second format: Translation element
                translation = location.find('txc:Translation', namespaces)
                if translation is not None:
                    longitude = translation.find('txc:Longitude', namespaces)
                    latitude = translation.find('txc:Latitude', namespaces)
                    if longitude is not None and latitude is not None:
                        stop_info['Longitude'] = longitude.text
                        stop_info['Latitude'] = latitude.text
        
        # Only add if we have at least a StopPointRef and CommonName
        if stop_info['StopPointRef'] and stop_info['CommonName']:
            stops.append(stop_info)
            
    return stops

def process_directory(root_dir):

    all_stops = defaultdict(dict)
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        print()
        for filename in filenames:
            if filename.lower().endswith('.xml'):
                xml_path = os.path.join(dirpath, filename)
                print(f"Processing {xml_path}")
                try:
                    stops = parse_stop_info(xml_path)
                    for stop in stops:
                        # Use StopPointRef as key to avoid duplicates
                        stop_id = stop['StopPointRef']
                        # Only add if we don't have it already or if we have more complete info
                        existing_stop = all_stops.get(stop_id)
                        if (not existing_stop or 
                            (existing_stop['Longitude'] is None and stop['Longitude'] is not None) or
                            (existing_stop['Latitude'] is None and stop['Latitude'] is not None)):
                            all_stops[stop_id] = stop
                except ET.ParseError as e:
                    print(f"Error parsing {xml_path}: {e}")
                except Exception as e:
                    print(f"Unexpected error processing {xml_path}: {e}")
    

    return list(all_stops.values())

def main():
  
    timetables_dir = os.path.join(os.getcwd(), 'TimeTables')
    output_file = os.path.join(os.getcwd(), 'all_stops.json')
    
    if not os.path.exists(timetables_dir):
        print(f"Error: Directory not found - {timetables_dir}")
        return
    

    all_stops = process_directory(timetables_dir)
    
    print(f"Found {len(all_stops)} unique stops.")
    
    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_stops, f, indent=2, ensure_ascii=False)
    
    print(f"Stop information saved to {output_file}")

if __name__ == '__main__':
    main()