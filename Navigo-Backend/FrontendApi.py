from flask import Flask, jsonify, request, g
from GoogleMapsApiHandler import GoogleMapsHandler
from flask_cors import CORS
import json
from MongoHandler import get_mongo_collections_by_word, flatten_mongo_results
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from dotenv import load_dotenv

app = Flask(__name__)

# MongoDB connection management
def get_db():
    if 'db' not in g:
        g.client = MongoClient("mongodb+srv://guilhermebarnes6:zBG2I0WSThNQiTSh@navigo.mistvwu.mongodb.net/?retryWrites=true&w=majority&appName=Navigo")
        g.db = g.client['Stops']
    return g.db

@app.teardown_appcontext
def teardown_db(exception):
    db = g.pop('db', None)
    if db is not None:
        g.client.close()

def get_maps_route(g_maps_handler, origin, destination, mode):
    directions_result = g_maps_handler.get_directions(
        origin=origin,
        destination=destination,
        mode=mode
    )
    return directions_result

import json
from pymongo import MongoClient

def extract_stop_info_bulk(stop_objects):
    print('I am being called')
    print(f'Original stop objects: {stop_objects}')
    
    try:
       
        clean_stop_refs = []
        sequence_map = {}  # To preserve sequence information
        
        for stop_obj in stop_objects:
            try:
                if isinstance(stop_obj, str):
                    stop_str = stop_obj.replace("'", '"')
                    stop_data = json.loads(stop_str)
                elif isinstance(stop_obj, dict):
                    stop_data = stop_obj
                else:
                    continue
                    
                stop_ref = stop_data['stop_ref']
                clean_stop_refs.append(stop_ref)
                sequence_map[stop_ref] = stop_data.get('sequence')
            except (json.JSONDecodeError, KeyError, AttributeError) as e:
                print(f" Couldn't parse stop object: {stop_obj} - {e}")
                continue
        
        print(f'Clean stop refs: {clean_stop_refs}')
        
        if not clean_stop_refs:
            print("No valid stop references found")
            return {}
        
        db = get_db()
        stops_cursor = db['AllStops'].find(
            {'StopPointRef': {'$in': clean_stop_refs}},
            {'_id': 0}  # Exclude MongoDB _id field
        )
        stops_list = list(stops_cursor)
      
        
      
        stops_dict = {}
        for stop in stops_list:
            stop_ref = stop['StopPointRef']
            if stop_ref in sequence_map:
                stop['sequence'] = sequence_map[stop_ref]
            stops_dict[stop_ref] = stop
        
        print(f'stops dict: {json.dumps(stops_dict, indent=2)}')
        return stops_dict
    except Exception as e:
        print(f"🔴 MongoDB Error: {e}")
        return {}

def extract_Journey_patterns(jp):
    if not jp or not isinstance(jp, list):
        return [], []
    
    # Collect all unique stop references first
    all_stop_refs = []
    for pattern in jp:
        if isinstance(pattern, dict) and 'stops' in pattern and isinstance(pattern['stops'], list):
            all_stop_refs.extend(pattern['stops'])  # Keep original format
    
    if not all_stop_refs:
        return [], []
    
    # Fetch all stops in one bulk query
    stops_dict = extract_stop_info_bulk(all_stop_refs)
    
    # Process journey patterns
    inbound_stops = []
    outbound_stops = []
    
    for pattern in jp:
        if not isinstance(pattern, dict):
            continue
            
        direction_stops = []
        if 'stops' in pattern and isinstance(pattern['stops'], list):
            for stop_obj in pattern['stops']:
                try:
                    # Handle both string and dict formats
                    if isinstance(stop_obj, str):
                        stop_str_clean = stop_obj.replace("'", '"')
                        stop_data = json.loads(stop_str_clean)
                    elif isinstance(stop_obj, dict):
                        stop_data = stop_obj
                    else:
                        continue
                        
                    stop_ref = stop_data.get('stop_ref')
                    if stop_ref and stop_ref in stops_dict:
                        stop_info = stops_dict[stop_ref]
                        # Preserve sequence from original data
                        if 'sequence' in stop_data:
                            stop_info['sequence'] = stop_data['sequence']
                        direction_stops.append(stop_info)
                except (json.JSONDecodeError, KeyError, AttributeError) as e:
                    print(f" Couldn't process stop: {stop_obj} - {e}")
                    continue
        
        if 'direction' in pattern and pattern['direction'] == "inbound":
            inbound_stops.extend(direction_stops)
        elif 'direction' in pattern:
            outbound_stops.extend(direction_stops)
    
    return inbound_stops, outbound_stops

@app.route('/api/getRouteInfo', methods=['GET'])
def get_route_info():
    try:
        origin = request.args.get("origin")
        destination = request.args.get("destination")
        g_maps_handler = GoogleMapsHandler()
        route = get_maps_route(g_maps_handler, origin, destination, "transit")
        parsed_route = g_maps_handler.parse_route_steps(route)
        transit_details = g_maps_handler.extract_transit_details(parsed_route)

        journey_patterns = []
        inbound_stops = {}
        outbound_stops = {}
        
        for each_bus in transit_details:
            operator = each_bus.get('operator')
            line_name = each_bus.get('line_short_name')
            
            collections_data = get_mongo_collections_by_word('RouteInfo', operator)
            
            # Variables to track the first inbound and outbound patterns
            first_inbound = None
            first_outbound = None
            
            # Convert ObjectId to string and find the first inbound and outbound patterns
            for coll_name, docs in collections_data.items():
                for doc in docs:
                    doc['_id'] = str(doc['_id'])
                    if doc['route_name'] == line_name:
                        for pattern in doc['journey_patterns']:
                            if pattern['direction'] == 'inbound' and first_inbound is None:
                                first_inbound = pattern
                            elif pattern['direction'] == 'outbound' and first_outbound is None:
                                first_outbound = pattern
                            if first_inbound and first_outbound:
                                break
                        if first_inbound and first_outbound:
                            break
                if first_inbound and first_outbound:
                    break
            
            # Append only the first inbound and outbound patterns, if found(For demo purposes only. Parsed xml not accurate)
            current_patterns = []
            if first_inbound:
                current_patterns.append(first_inbound)
            if first_outbound:
                current_patterns.append(first_outbound)
            
            journey_patterns.extend(current_patterns)
            
            # Extract stops from the selected journey patterns
            inbound_stops[line_name], outbound_stops[line_name] = extract_Journey_patterns(current_patterns)

        response_data = {
            'status': 'success',
            'data': {
                'parsed_route': parsed_route,
                'transit_details': transit_details,
                'journey_pattern': journey_patterns,
                'inbound_bus_stops': inbound_stops,
                'outbound_bus_stops': outbound_stops
            }
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/')
def home():
    return "Flask server is running. Use /api/getRouteInfo endpoint for directions."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # This makes it accessible on all network interfaces