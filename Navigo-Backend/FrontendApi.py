from flask import Flask, jsonify, request
from GoogleMapsApiHandler import GoogleMapsHandler
import json

app = Flask(__name__)


def get_maps_route(g_maps_handler,origin, destination, mode):
    
    directions_result = g_maps_handler.get_directions(
        origin=origin,
        destination=destination,
        mode=mode
    )
    
   
    
    return directions_result


@app.route('/api/getRouteInfo', methods=['GET'])
def get_route_info():
    try:
        g_maps_handler = GoogleMapsHandler()
       
        route = get_maps_route(g_maps_handler,"DE22 3aw", "Derby bus station", "transit")
        
        # Parse the steps
        parsed_rotue= g_maps_handler.parse_route_steps(route) 
        
        # Prepare the response
        response_data = {
            'status': 'success',
            'data': {
                
        
                'raw_route': parsed_rotue
             
            }
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500







if __name__ == '__main__':
    app.run(debug=True)