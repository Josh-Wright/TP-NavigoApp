import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

def process_route_patterns(file_path):

   
    client = MongoClient(MONGO_URI)
    db = client['RouteInfo']
   
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    for route_data in data:
        operator_ref = route_data['operator_ref']
        operator_name = route_data['operator_name']
        line_ref = route_data['line_ref']
        
        # Prepare the document structure
        doc = {
            'line_ref': line_ref,
            'route_name': route_data['route_name'],
            'file_name': route_data['file_name'],
            'journey_patterns': route_data['journey_patterns']
        }
        
 
        collection = db[f'{operator_name} {operator_ref}']
     
        existing_doc = collection.find_one({'line_ref': line_ref})
        
        if existing_doc:
          
            collection.update_one(
                {'_id': existing_doc['_id']},
                {'$set': {
                    'route_name': doc['route_name'],
                    'file_name': doc['file_name'],
                    'journey_patterns': doc['journey_patterns']
                }}
            )
            print(f"Updated document for line_ref: {line_ref} in collection: {operator_ref}")
        else:
          
            collection.insert_one(doc)
            print(f"Inserted new document for line_ref: {line_ref} in collection: {operator_ref}")
    
    client.close()
    print("Route patterns processing complete.")

def process_all_stops(file_path):
    """Process all stops and store in Stops database"""
  
    client = MongoClient(MONGO_URI)
    db = client['Stops']
    collection = db['AllStops']
    
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
  
    collection.delete_many({})

    collection.insert_many(data)
    
    client.close()
    print(f"Inserted {len(data)} stop records into AllStops collection.")

if __name__ == '__main__':
    
    json_file_path = 'route_patterns.json'
    
    # Process route patterns
    process_route_patterns(json_file_path)
    
    # Process all stops
    process_all_stops("all_stops.json")