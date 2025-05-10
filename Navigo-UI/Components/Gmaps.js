import MapViewDirections from 'react-native-maps-directions';

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const REDACTED = "REDACTED";

<MapView >
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={REDACTED}
  />
</MapView>