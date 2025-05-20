# Import necessary libraries
import os
import re
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from dotenv import load_dotenv
import json

def get_mongo_collections_by_word(db_name, word_in_collection_name):
    
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI")

   

    print("Connecting to MongoDB ")

    try:
        
        client = MongoClient(mongo_uri)
      
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")

        # Access the specified database
        db = client[db_name]
        print(f"Accessed database: '{db_name}'")

        # Get a list of all collection names in the database
        collection_names = db.list_collection_names()
        print(f"Found collections: {collection_names}")

        matching_collections_data = {}
        found_match = False

        # Iterate over collection names and find matches
        for coll_name in collection_names:
            # Use a case-insensitive search for the word
            if word_in_collection_name in coll_name:
                found_match = True
                print(f"\nFound matching collection: '{coll_name}'")
                collection = db[coll_name]
                documents = list(collection.find({})) # Fetch all documents
                matching_collections_data[coll_name] = documents
              

        if not found_match:
            print(f"No collections found in database '{db_name}' with  '{word_in_collection_name}' ")

        return matching_collections_data

    except ConnectionFailure:
        print("Error: Failed to connect to MongoDB. Check your MONGO_URI and network settings.")
        return {}
    except OperationFailure as e:
        print(f"Error: MongoDB operation failed: {e.details}")
        return {}
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {}
    finally:
        if 'client' in locals() and client:
            client.close()
            print("MongoDB connection closed.")


def flatten_mongo_results(collections_data):
    """
    Takes the result from get_mongo_collections_by_word() and returns all documents in a flat list.
    
    Args:
        collections_data (dict): The dictionary returned by get_mongo_collections_by_word()
                               Format: {collection_name: [doc1, doc2, ...]}
    
    Returns:
        list: A flat list containing all documents from all matching collections
    """
    if not collections_data:
        return []
    
    all_documents = []
    
    for collection_name, documents in collections_data.items():
        if documents:  # Only extend if documents exist
            all_documents.extend(documents)


    
    return list(all_documents)

def extract_stop_info(StopPointRef,dbName='Stops',collection='AllStops',):
    




    client = MongoClient("mongodb+srv://guilhermebarnes6:zBG2I0WSThNQiTSh@navigo.mistvwu.mongodb.net/?retryWrites=true&w=majority&appName=Navigo")
    db = client[dbName]
    all_stops_collection = db[collection].find({'StopPointRef':StopPointRef})

    return list(all_stops_collection)

# if __name__ == "__main__":

#     database_name = "RouteInfo"

#     search_word = "Notts and Derby"


#     retrieved_data = get_mongo_collections_by_word(database_name, search_word)

#     if retrieved_data:
      
#         for collection_name, docs in retrieved_data.items():
#             print(f"Collection '{collection_name}': {len(docs)} documents.")
          
#             print(docs)
#     else:
#         print("No data was retrieved.")

