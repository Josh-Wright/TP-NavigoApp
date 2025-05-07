from flask import Flask, jsonify, request
from GoogleMapsApiHandler import GoogleMapsHandler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/getRouteInfo', methods=['GET'])
def get_route_info():
    # Get parameters from query string
    origin = request.args.get('origin', 'DE22 3FY')  # default values
    destination = request.args.get('destination', 'DE22 1GB')
    mode = request.args.get('mode', 'transit')  # transit, driving, walking, bicycling
    
    try:
        g_maps_handler = GoogleMapsHandler()
        directions_result = g_maps_handler.get_directions(
            origin=origin,
            destination=destination,
            mode=mode
        )
        
        parsed_directions = g_maps_handler.parse_directions(directions_result)
        
        return jsonify({
            'status': 'success',
            'data': parsed_directions
        })
    
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