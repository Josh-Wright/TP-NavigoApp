import xml.etree.ElementTree as ET
from collections import defaultdict

def parse_transxchange_xml(xml_file):
    """
    Parses a TransXChange XML file and extracts route information.
    
    Args:
        xml_file (str): Path to the XML file
        
    Returns:
        dict: Dictionary containing stops and routes data
    """
    # Parse the XML file
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    # Namespace handling
    ns = {'txc': 'http://www.transxchange.org.uk/'}
    
    # Step 1: Extract all stops
    stops = {}
    for stop in root.findall('.//txc:AnnotatedStopPointRef', ns):
        stop_ref = stop.find('txc:StopPointRef', ns).text
        stops[stop_ref] = {
            'name': stop.find('txc:CommonName', ns).text,
            'indicator': stop.find('txc:Indicator', ns).text if stop.find('txc:Indicator', ns) is not None else None,
            'locality': stop.find('txc:LocalityName', ns).text
        }
    
    # Step 2: Extract route sections and links
    routes = []
    for section in root.findall('.//txc:RouteSection', ns):
        route_links = []
        
        for link in section.findall('txc:RouteLink', ns):
            from_stop = link.find('txc:From/txc:StopPointRef', ns).text
            to_stop = link.find('txc:To/txc:StopPointRef', ns).text
            distance = link.find('txc:Distance', ns).text
            
            # Get all track points
            track_points = []
            for point in link.findall('.//txc:Location', ns):
                translation = point.find('txc:Translation', ns)
                track_points.append({
                    'easting': translation.find('txc:Easting', ns).text,
                    'northing': translation.find('txc:Northing', ns).text,
                    'longitude': translation.find('txc:Longitude', ns).text,
                    'latitude': translation.find('txc:Latitude', ns).text
                })
            
            route_links.append({
                'from': from_stop,
                'to': to_stop,
                'distance': distance,
                'track': track_points
            })
        
        routes.append({
            'id': section.get('id'),
            'links': route_links
        })
    
    # Step 3: Reconstruct the complete route sequence
    if routes and routes[0]['links']:
        route_sequence = []
        link_dict = defaultdict(list)
        
        # Create a mapping of from_stop to link
        for route in routes:
            for link in route['links']:
                link_dict[link['from']].append(link)
        
        # Start with the first link of the first route
        current_link = routes[0]['links'][0]
        route_sequence.append({
            'stop': current_link['from'],
            'details': stops.get(current_link['from'], {})
        
        while current_link:
            route_sequence.append({
                'stop': current_link['to'],
                'details': stops.get(current_link['to'], {})
            
            # Find next link that starts where this one ends
            next_links = link_dict.get(current_link['to'], [])
            current_link = next_links[0] if next_links else None
    
    return {
        'stops': stops,
        'routes': routes,
        'route_sequence': route_sequence
    }

def print_route_info(route_data):
    """Prints the extracted route information in a readable format"""
    print("="*50)
    print("Bus Stops (Total: {})".format(len(route_data['stops'])))
    print("="*50)
    for stop_ref, details in list(route_data['stops'].items())[:5]:  # Print first 5 as sample
        print(f"{stop_ref}: {details['name']} ({details['indicator']}) - {details['locality']}")
    print("[...]")  # Indicates there are more stops
    
    print("\n" + "="*50)
    print("Route Sequence (Total stops: {})".format(len(route_data['route_sequence'])))
    print("="*50)
    for i, stop in enumerate(route_data['route_sequence'][:10], 1):  # Print first 10 as sample
        print(f"{i}. {stop['stop']}: {stop['details']['name']}")
    print("[...]")  # Indicates there are more stops
    
    print("\n" + "="*50)
    print("Route Links (Total: {})".format(sum(len(r['links']) for r in route_data['routes'])))
    print("="*50)
    for i, route in enumerate(route_data['routes'], 1):
        print(f"\nRoute Section {i} ({route['id']}):")
        for j, link in enumerate(route['links'][:3], 1):  # Print first 3 links per route as sample
            print(f"  Link {j}: From {link['from']} to {link['to']} ({link['distance']}m)")
            print(f"    Track points: {len(link['track'])}")
        if len(route['links']) > 3:
            print(f"  [...] {len(route['links']) - 3} more links")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python transxchange_parser.py <path_to_xml_file>")
        sys.exit(1)
    
    xml_file = sys.argv[1]
    print(f"Parsing TransXChange file: {xml_file}")
    
    try:
        route_data = parse_transxchange_xml(xml_file)
        print_route_info(route_data)
    except ET.ParseError as e:
        print(f"Error parsing XML file: {e}")
    except Exception as e:
        print(f"Error: {e}")