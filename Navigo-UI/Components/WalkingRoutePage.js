import Header from "./Header";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faMapMarkerAlt,
  faInfoCircle,
  faClock,
  faHeadset,
  faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import Constants from "expo-constants";
import polyline from "@mapbox/polyline";

const GOOGLE_MAPS_APIKEY = Constants.expoConfig.extra.GOOGLE_MAPS_APIKEY;

export default function WalkingRoutePage({ step, origin, destination, onNextStep }) {
  // Decode polyline to coordinates for Polyline component
  const decodedPoints = polyline.decode(step.polyline);
  const coordinates = decodedPoints.map((point) => ({
    latitude: point[0],
    longitude: point[1],
  }));

  return (
    <View style={styles.container}>
    
      <RouteSummary instruction={step.instruction} />
      <Body>
        <NextStop instruction={step.instruction} duration={step.duration} />
        <Destination destination={destination} duration={step.duration} />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: (step.start_location.lat + step.end_location.lat) / 2,
              longitude: (step.start_location.lng + step.end_location.lng) / 2,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{ latitude: step.start_location.lat, longitude: step.start_location.lng }}
              title="Start"
            />
            <Marker
              coordinate={{ latitude: step.end_location.lat, longitude: step.end_location.lng }}
              title="End"
            />
            <Polyline
              coordinates={coordinates}
              strokeColor="blue"
              strokeWidth={3}
            />
          </MapView>
        </View>
        <Support />
      </Body>
    </View>
  );
}

function NextStop({ instruction, duration }) {
  return (
    <View style={nextStopStyles.container}>
      <Text style={nextStopStyles.title}>Instruction: {instruction.replace(/<[^>]+>/g, '')}</Text>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faInfoCircle} color="#0e766f" />
        <Text style={nextStopStyles.text}>Complete in {duration}</Text>
      </View>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faClock} color="#0e766f" />
        <Text style={nextStopStyles.text}>Follow the path</Text>
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
          <Text style={notificationStyles.title}>Getting Close!</Text>
          <Text style={notificationStyles.text}>Your destination is nearby</Text>
          <Text style={notificationStyles.text}>Approximately 1 minute</Text>
        </View>
      </View>
    </View>
  );
}

function Destination({ destination, duration }) {
  return (
    <View style={nextStopStyles.container}>
      <Text style={nextStopStyles.title}>Next Instruction: {destination}</Text>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faInfoCircle} color="#0e766f" />
        <Text style={nextStopStyles.text}>Arriving in {duration}</Text>
      </View>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faClock} color="#0e766f" />
        <Text style={nextStopStyles.text}>You will receive alerts as you get closer</Text>
      </View>
    </View>
  );
}

function Support() {
  return (
    <View style={supportStyles.container}>
      <TouchableOpacity style={supportStyles.forgotButton}>
        <FontAwesomeIcon icon={faInfoCircle} color="#ffffff" />
        <Text style={supportStyles.buttonText}>Instructions not clear</Text>
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

function RouteSummary({ instruction }) {
  const progress = 50; // Placeholder: Calculate based on actual progress

  return (
    <View style={routeSummaryStyles.container}>
      <View style={styles.currentJourneyContainer}>
        <FontAwesomeIcon icon={faMapMarkerAlt} color="#ffffff" />
        <View style={styles.journeyTextContainer}>
          <Text style={routeSummaryStyles.text}>Current Steps</Text>
          <Text style={styles.journeySubText}>{instruction.replace(/<[^>]+>/g, '')}</Text>
        </View>
      </View>
      <View style={styles.locationInfoContainer}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>Current Location</Text>
          <Text style={styles.locationText}>Next Location</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.completedProgress, { width: `${progress}%` }]} />
          <View style={[styles.remainingProgress, { width: `${100 - progress}%` }]} />
          <View style={[styles.busIconContainer, { left: `${progress}%` }]}>
            <View style={styles.busIcon}>
              <FontAwesomeIcon icon={faPersonWalking} color="#0e766f" size={12} />
            </View>
          </View>
        </View>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>Steps completed</Text>
          <Text style={styles.locationText}>Steps remaining</Text>
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
    flex: 1,
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
    flexDirection: "row",
  },
  completedProgress: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  remainingProgress: {
    height: "100%",
    backgroundColor: "#115f58",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  busIconContainer: {
    position: "absolute",
    top: -8,
    width: 30,
    height: 30,
    marginLeft: -15,
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