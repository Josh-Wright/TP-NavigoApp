import Header from "./Header";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faMapMarkerAlt,
  faInfoCircle,
  faClock,
  faHandPointer,
  faHeadset,
  faBus,
} from "@fortawesome/free-solid-svg-icons";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const origin = { latitude: 52.929488857183586, longitude: -1.497704357336529 };
const destination = {
  latitude: 52.91902299061751,
  longitude: -1.472203979339939,
};
const REDACTED = "REDACTED";
const waypoint1 = {
  latitude: 52.923025311374005,
  longitude: -1.4813591528924195,
};
const waypoint2 = {
  latitude: 52.92430774323713,
  longitude: -1.4809774950254628,
};

export default function BusRoutePage() {
  return (
    <View style={styles.container}>
      <Header />
      <RouteSummary />

      <Body>
        {/* <ProximityNotification /> */}
        <NextStop/>
        <Destination />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: (origin.latitude + destination.latitude) / 2,
              longitude: (origin.longitude + destination.longitude) / 2,
              latitudeDelta: 0.015, //zoom
              longitudeDelta: 0.015,
            }}
          >
            <Marker coordinate={origin} title="Origin" />
            <Marker coordinate={destination} title="Destination" />
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={REDACTED}
              strokeWidth={3}
              strokeColor="black"
              waypoints={[waypoint1, waypoint2]}
            />
          </MapView>
        </View>
        <Support />
      </Body>
    </View>
  );
}

function NextStop() {
  return (
    <View style={nextStopStyles.container}>
      <Text style={nextStopStyles.title}>Next stop: Keddleston road</Text>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faInfoCircle} color="#0e766f" />
        <Text style={nextStopStyles.text}>Arriving in 2 minutes</Text>
      </View>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faClock} color="#0e766f" />
        <Text style={nextStopStyles.text}>This is not your stop</Text>
      </View>
    
    </View>
  );
}

function ProximityNotification() {
  return (
    <View style={notificationStyles.container}>
      <View style={notificationStyles.contentContainer}>
        <View style={notificationStyles.iconContainer}>
          <FontAwesomeIcon icon={faBell} size={12} color="#ffffff" />
        </View>
        <View style={notificationStyles.textContainer}>
          <Text style={notificationStyles.title}>Getting Close !</Text>
          <Text style={notificationStyles.text}>
            Your stop, UOD stret, is 2 stops away
          </Text>
          <Text style={notificationStyles.text}>Approximately 4 minutes</Text>
        </View>
      </View>
    </View>
  );
}

function Destination() {
  return (
    <View style={nextStopStyles.container}>
      <Text style={nextStopStyles.title}>Your Destination: MS125</Text>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faInfoCircle} color="#0e766f" />
        <Text style={nextStopStyles.text}>
          Arriving in approximately 4 minutes
        </Text>
      </View>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faClock} color="#0e766f" />
        <Text style={nextStopStyles.text}>
          You will receive alerts as you get closer
        </Text>
      </View>
      <TouchableOpacity style={nextStopStyles.button}>
        <FontAwesomeIcon icon={faHandPointer} color="#ffffff" />
        <Text style={nextStopStyles.buttonText}>Get me off this busss!!</Text>
      </TouchableOpacity>
    </View>
  );
}

function Support() {
  return (
    <View style={supportStyles.container}>
      <TouchableOpacity style={supportStyles.forgotButton}>
        <FontAwesomeIcon icon={faInfoCircle} color="#ffffff" />
        <Text style={supportStyles.buttonText}>I forgot to get off</Text>
      </TouchableOpacity>
      <TouchableOpacity style={supportStyles.helpButton}>
        <FontAwesomeIcon icon={faHeadset} color="#ffffff" />
        <Text style={supportStyles.buttonText}>Navigo broke. HELP!!!</Text>
      </TouchableOpacity>
    </View>
  );
}

function Body({ children }) {
  return <View style={styles.body}>{children}</View>;
}

function RouteSummary() {
  const progress = 50; 
  
  return (
    <View style={routeSummaryStyles.container}>
      <View style={styles.currentJourneyContainer}>
        <FontAwesomeIcon icon={faMapMarkerAlt} color="#ffffff" />
        <View style={styles.journeyTextContainer}>
          <Text style={routeSummaryStyles.text}>Current Journey</Text>
          <Text style={styles.journeySubText}>Bus x to Location y </Text>
        </View>
      </View>
      <View style={styles.locationInfoContainer}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>Current Location</Text>
          <Text style={styles.locationText}>Next Location</Text>
        </View>
        {/* Changed: Replaced simple progress bar with new segmented version */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.completedProgress, { width: `${progress}%` }]} />
          <View style={[styles.remainingProgress, { width: `${100 - progress}%` }]} />
          <View style={[styles.busIconContainer, { left: `${progress}%` }]}>
            <View style={styles.busIcon}>
              <FontAwesomeIcon icon={faBus} color="#0e766f" size={12} />
            </View>
          </View>
        </View>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>2 stops passed</Text>
          <Text style={styles.locationText}>2 stops remaining</Text>
        </View>
      </View>
    </View>
  );
}

// Main styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  currentJourneyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  journeyTextContainer: {
    marginLeft: 10,
  },
  // Changed: Removed old journeyProgressBar style
  journeySubText: {
    color: "#ffffff",
  },
  locationInfoContainer: {
    backgroundColor: "#0e766f",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationText: {
    color: "#fff",
  },
  mapContainer: { 
    flex: 1 
  },
  mapView: {
    flex: 1,
    width: "100%",
  },

  progressBarContainer: {
    height: 12,
    width: "100%",
    borderRadius: 15,
    marginVertical: 10,
    flexDirection: 'row',
  
  
  },
  completedProgress: {
    height: '100%',
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  remainingProgress: {
    height: '100%',
    backgroundColor: "#115f58",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  busIconContainer: {
    position: 'absolute',
    top: -8,
    width: 30,
    height: 30,
    marginLeft: -15, // Center the icon on the progress point
  },
  busIcon: {
    backgroundColor: "#FFFFFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#0e766f",
    justifyContent: "center",
    alignItems: "center",
  },
});

const routeSummaryStyles = StyleSheet.create({
  container: {
    backgroundColor: "#0c9588",
    width: "100%",
    padding: 16,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 0,
  },
});

const notificationStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fefaeb",
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#f7a926",
    padding: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    backgroundColor: "#f7a926",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
  },
});

const nextStopStyles = StyleSheet.create({
  container: {
    flexDirection: 1,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    padding: 10,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 12,
  },
  button: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#0e766f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
});

const supportStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
  },
  forgotButton: {
    flexDirection: "row",
    width: "48%",
    backgroundColor: "#7C26A0",
    padding: 10,
    borderRadius: 10,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  helpButton: {
    flexDirection: "row",
    width: "50%",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
});