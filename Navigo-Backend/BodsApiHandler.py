import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Set the URL and parameters
url = "https://data.bus-data.dft.gov.uk/api/v1/datafeed"  # Bods URL
params = {
    "api_key": os.getenv("BODS_KEY"),  # My key
    
}

def getLocationData(lineRef,operatorRef,params):
    try:
        params['lineRef'] = lineRef #Desired bus route identifier
        params['operatorRef'] = operatorRef #operator identifier
        #get request
        
        response = requests.get(url, params=params)

        # Check for successful response
        if response.status_code == 200:
            print("Request OK")
            # print siri  XML as a string
            xml_string = response.text
            print(f"XML Response :\n{xml_string}")
            
        else:
            print(f"Request failed, status code: {response.status_code}")
            print("Response:", response.text)

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


getLocationData('ra','TBTN',params)