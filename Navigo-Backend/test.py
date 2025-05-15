import xml.etree.ElementTree as ET
import json
import os
from collections import defaultdict



def parse_transxchange(file_path):
  
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        ns = {'txc': 'http://www.transxchange.org.uk/'}

        # Extract OperatorRef
        operator_ref = root.find('.//txc:Operators/txc:Operator/txc:NationalOperatorCode', ns)
        if operator_ref is None:
            operator_ref = root.find('.//txc:Operators/txc:Operator/txc:OperatorCode', ns)
        operator_ref = operator_ref.text if operator_ref is not None else None

        # Extract LineRef
        line_ref = root.find('.//txc:Services/txc:Service/txc:Line/txc:LineName', ns)
        if line_ref is None:
            line_ref = root.find('.//txc:Services/txc:Service/txc:Lines/txc:Line/txc:LineName', ns)
        line_ref = line_ref.text if line_ref is not None else None

        # Extract RouteName
        route_name = root.find('.//txc:Services/txc:Service/txc:Line/txc:MarketingName', ns)
        if route_name is None:
            route_name = root.find('.//txc:Services/txc:Service//txc:MarketingName', ns)
        route_name = route_name.text if route_name is not None else line_ref

        # Process Journey Patterns
        journey_patterns = []
        for jp in root.findall('.//txc:JourneyPattern', ns):
            jp_ref = jp.get('id')
            direction = jp.find('txc:Direction', ns)
            direction = direction.text if direction is not None else 'unknown'
            route_ref = jp.find('txc:RouteRef', ns)
            route_ref = route_ref.text if route_ref is not None else None
            jp_section_ref = jp.find('txc:JourneyPatternSectionRefs', ns)
            jp_section_ref = jp_section_ref.text if jp_section_ref is not None else None

            # Find the corresponding JourneyPatternSection
            stops = []
            seen_stops = set()
            sequence = 1
            if jp_section_ref:
                jp_section = root.find(f".//txc:JourneyPatternSections/txc:JourneyPatternSection[@id='{jp_section_ref}']", ns)
                if jp_section is not None:
                    for timing_link in jp_section.findall('txc:JourneyPatternTimingLink', ns):
                        from_stop = timing_link.find('txc:From/txc:StopPointRef', ns)
                        to_stop = timing_link.find('txc:To/txc:StopPointRef', ns)

                        if from_stop is not None and from_stop.text not in seen_stops:
                            stops.append({
                                "stop_ref": from_stop.text,
                                "sequence": sequence
                            })
                            seen_stops.add(from_stop.text)
                            sequence += 1

                        if to_stop is not None and to_stop.text not in seen_stops:
                            stops.append({
                                "stop_ref": to_stop.text,
                                "sequence": sequence
                            })
                            seen_stops.add(to_stop.text)
                            sequence += 1

            journey_patterns.append({
                "journey_pattern_ref": jp_ref,
                "direction": direction,
                "route_ref": route_ref,
                "stops": stops
            })

        return {
            "file_name": file_path,
            "operator_ref": operator_ref,
            "line_ref": line_ref,
            "route_name": route_name,
            "journey_patterns": journey_patterns
        }

    except ET.ParseError as e:
        print(f"Error parsing XML file {file_path}: {e}")
        return None
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred for {file_path}: {e}")
        return None

def find_all_xml_files(directory):
    """Recursively find all XML files in the given directory and its subdirectories."""
    xml_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.xml'):
                xml_files.append(os.path.join(root, file))
    return xml_files

def process_files(directory):
  
    xml_files = find_all_xml_files(directory)
    

  
    route_results = []
    
    # Using dictionaries to avoid duplicates based on operator_ref and line_ref
  
    route_dict = defaultdict(list)
    
    for file_path in xml_files:
        print(f"Processing file: {file_path}")
      
        
        # Second parser
        result2 = parse_transxchange(file_path)
        if result2 and result2['operator_ref'] and result2['line_ref']:
            key = (result2['operator_ref'], result2['line_ref'])
            if not any(r['file_name'] == result2['file_name'] for r in route_dict[key]):
                route_dict[key].append(result2)
    
  
    
    for key in route_dict:
        route_results.extend(route_dict[key])
    
    return route_results

def main():
    # Process all XML files in the TimeTables directory
    route_results = process_files('./TimeTables')
    
   
    
    with open('route_patterns.json', 'w') as f:
        json.dump(route_results, f, indent=2)
    
  
if __name__ == '__main__':
    main()