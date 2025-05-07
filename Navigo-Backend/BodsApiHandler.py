import requests
from dotenv import load_dotenv
import os
import json

import xml.etree.ElementTree as ET

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
            # print(f"XML Response :\n{xml_string}")
            return xml_string
            
        else:
            print(f"Request failed, status code: {response.status_code}")
            print("Response:", response.text)

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")




def parse_siri_xml(xml_string):

    try:
        root = ET.fromstring(xml_string)
        # Define the namespace to handle the xmlns attributes
        namespaces = {'siri': 'http://www.siri.org.uk/siri'}
        vehicle_activities = []
        for vehicle_activity_element in root.findall('.//siri:VehicleActivity', namespaces):
            activity_data = {}
            activity_data['RecordedAtTime'] = vehicle_activity_element.find('./siri:RecordedAtTime', namespaces).text
            activity_data['ItemIdentifier'] = vehicle_activity_element.find('./siri:ItemIdentifier', namespaces).text
            activity_data['ValidUntilTime'] = vehicle_activity_element.find('./siri:ValidUntilTime', namespaces).text

            monitored_vehicle_journey = vehicle_activity_element.find('./siri:MonitoredVehicleJourney', namespaces)
            if monitored_vehicle_journey is not None:
                mvj_data = {}
                mvj_data['LineRef'] = monitored_vehicle_journey.find('./siri:LineRef', namespaces).text
                mvj_data['DirectionRef'] = monitored_vehicle_journey.find('./siri:DirectionRef', namespaces).text

                framed_vehicle_journey_ref = monitored_vehicle_journey.find('./siri:FramedVehicleJourneyRef', namespaces)
                if framed_vehicle_journey_ref is not None:
                    fvjr_data = {}
                    fvjr_data['DataFrameRef'] = framed_vehicle_journey_ref.find('./siri:DataFrameRef', namespaces).text
                    fvjr_data['DatedVehicleJourneyRef'] = framed_vehicle_journey_ref.find('./siri:DatedVehicleJourneyRef', namespaces).text
                    mvj_data['FramedVehicleJourneyRef'] = fvjr_data

                mvj_data['PublishedLineName'] = monitored_vehicle_journey.find('./siri:PublishedLineName', namespaces).text
                mvj_data['OperatorRef'] = monitored_vehicle_journey.find('./siri:OperatorRef', namespaces).text
                mvj_data['OriginRef'] = monitored_vehicle_journey.find('./siri:OriginRef', namespaces).text
                mvj_data['OriginName'] = monitored_vehicle_journey.find('./siri:OriginName', namespaces).text
                mvj_data['DestinationRef'] = monitored_vehicle_journey.find('./siri:DestinationRef', namespaces).text
                mvj_data['DestinationName'] = monitored_vehicle_journey.find('./siri:DestinationName', namespaces).text
                mvj_data['OriginAimedDepartureTime'] = monitored_vehicle_journey.find('./siri:OriginAimedDepartureTime', namespaces).text
                mvj_data['DestinationAimedArrivalTime'] = monitored_vehicle_journey.find('./siri:DestinationAimedArrivalTime', namespaces).text

                vehicle_location = monitored_vehicle_journey.find('./siri:VehicleLocation', namespaces)
                if vehicle_location is not None:
                    location_data = {}
                    location_data['Longitude'] = vehicle_location.find('./siri:Longitude', namespaces).text
                    location_data['Latitude'] = vehicle_location.find('./siri:Latitude', namespaces).text
                    mvj_data['VehicleLocation'] = location_data

                block_ref = monitored_vehicle_journey.find('./siri:BlockRef', namespaces)
                if block_ref is not None:
                    mvj_data['BlockRef'] = block_ref.text

                vehicle_ref = monitored_vehicle_journey.find('./siri:VehicleRef', namespaces)
                if vehicle_ref is not None:
                    mvj_data['VehicleRef'] = vehicle_ref.text

                bearing = monitored_vehicle_journey.find('./siri:Bearing', namespaces)
                if bearing is not None:
                    mvj_data['Bearing'] = bearing.text

                activity_data['MonitoredVehicleJourney'] = mvj_data

            extensions = vehicle_activity_element.find('./siri:Extensions/siri:VehicleJourney', namespaces)
            if extensions is not None:
                extensions_data = {}
                operational = extensions.find('./siri:Operational/siri:TicketMachine', namespaces)
                if operational is not None:
                    ticket_machine_data = {}
                    ticket_machine_data['TicketMachineServiceCode'] = operational.find('./siri:TicketMachineServiceCode', namespaces).text
                    ticket_machine_data['JourneyCode'] = operational.find('./siri:JourneyCode', namespaces).text
                    extensions_data['Operational'] = {'TicketMachine': ticket_machine_data}

                vehicle_unique_id = extensions.find('./siri:VehicleUniqueId', namespaces)
                if vehicle_unique_id is not None:
                    extensions_data['VehicleUniqueId'] = vehicle_unique_id.text

                activity_data['Extensions'] = {'VehicleJourney': extensions_data}

            vehicle_activities.append(activity_data)
        return vehicle_activities
    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
        return None

# The XML string you provided
#Testing
print(json.dumps(parse_siri_xml(getLocationData('U1','NDTR',params)),indent=4))
testing = parse_siri_xml(getLocationData('U1','NDTR',params))[0
                                                              ]["MonitoredVehicleJourney"]["VehicleLocation"]
print(f"{testing['Latitude']},{testing['Longitude']}")
