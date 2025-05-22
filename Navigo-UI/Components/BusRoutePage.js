import Header from "./Header";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import Constants from "expo-constants";
import { useEffect } from "react";
import * as Speech from "expo-speech";

const GOOGLE_MAPS_APIKEY = Constants.expoConfig.extra.GOOGLE_MAPS_APIKEY;

export default function BusRoutePage({
  step,
  transitDetails,
  transitStops,
  origin,
  destination,
  onNextStep,
  currentStep,
  parsed_route,
  children
}) {
  const transitDetail =
    transitDetails.find((detail) => detail.stepNumber === currentStep?.step_number) ||
    {};
  const outboundStops = transitStops?.outbound?.U2 || [];

  // Create waypoints from outbound stops
  const waypoints = outboundStops.map((stop) => ({
    latitude: parseFloat(stop.Latitude),
    longitude: parseFloat(stop.Longitude),
  }));

  // Create array of stop names
  const stopNames = outboundStops.map((stop) => stop.CommonName);

  // Speech announcement on mount
  useEffect(() => {
    const cleanInstruction = step.html_instructions?.replace(/<[^>]+>/g, "") || "Continue on bus";
    const announcement = `
      Bus route information. 
      You are on step ${currentStep?.step_number} of ${parsed_route?.length}.
      Take bus ${transitDetail.lineName || 'unknown'} from ${transitDetail.departureStop || 'current location'}.
      Next stop is ${stopNames[1] || "unknown"}.
      ${cleanInstruction}.
      Your destination is ${transitDetail.arrivalStop || destination} arriving in ${step.duration || 'shortly'}.
    `;
    
    Speech.speak(announcement, { 
      language: "en-GB",
      rate: 0.8 // Slightly slower for clarity
    });

    return () => Speech.stop(); // Cleanup on unmount
  }, [step, transitDetail, currentStep]);

  return (
    <View style={styles.container}>
      <RouteSummary
        departureStop={transitDetail.departureStop}
        arrivalStop={transitDetail.arrivalStop}
        lineName={transitDetail.lineName}
        currentStep={currentStep}
        parsed_route={parsed_route}
      />
      <Body>
        <NextStop
          nextStop={stopNames[1] || "Next Stop"}
          duration={step.duration}
        />
        <Destination
          arrivalStop={transitDetail.arrivalStop}
          duration={transitDetail.duration}
        />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: (step.start_location.lat + step.end_location.lat) / 2,
              longitude: (step.start_location.lng + step.end_location.lng) / 2,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
          >
            <Marker
              coordinate={{
                latitude: step.start_location.lat,
                longitude: step.start_location.lng,
              }}
              title="Start"
            />
            <Marker
              coordinate={{
                latitude: step.end_location.lat,
                longitude: step.end_location.lng,
              }}
              title="End"
            />
            <MapViewDirections
              origin={{
                latitude: step.start_location.lat,
                longitude: step.start_location.lng,
              }}
              destination={{
                latitude: step.end_location.lat,
                longitude: step.end_location.lng,
              }}
              waypoints={waypoints}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="blue"
            />
            {waypoints.map((point, index) => (
              <Marker
                key={`stop-${index}`}
                coordinate={point}
                title={stopNames[index]}
                pinColor="blue"
              />
            ))}
          </MapView>
        </View>
      {children}
        {/* <Support /> */}
        <TouchableOpacity
          style={styles.repeatButton}
          onPress={() => {
            const cleanInstruction = step.html_instructions?.replace(/<[^>]+>/g, "") || "Continue on bus";
            const announcement = `
              Repeating instructions:
              Take bus ${transitDetail.lineName} from ${transitDetail.departureStop}.
              Next stop is ${stopNames[1] || "unknown"}.
              ${cleanInstruction}.
              Arriving at ${transitDetail.arrivalStop} in ${step.duration}.
            `;
            Speech.speak(announcement, { language: "en-GB" });
          }}
          accessibilityLabel="Repeat instructions"
          accessibilityHint="Repeats the current bus route information"
        >
          <Text style={styles.repeatButtonText}>Repeat Instructions</Text>
        </TouchableOpacity>
      </Body>
    </View>
  );
}

function NextStop({ nextStop, duration }) {
  return (
    <View style={nextStopStyles.container}>
      <Text style={nextStopStyles.title}>Next Stop: {nextStop}</Text>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faInfoCircle} color="#0e766f" />
        <Text style={nextStopStyles.text}>Arriving in {duration}</Text>
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
          <Text style={notificationStyles.title}>Getting Close!</Text>
          <Text style={notificationStyles.text}>Your stop is 2 stops away</Text>
          <Text style={notificationStyles.text}>Approximately 4 minutes</Text>
        </View>
      </View>
    </View>
  );
}

function Destination({ arrivalStop, duration }) {
  return (
    <View style={nextStopStyles.container}>
      <Text style={nextStopStyles.title}>Your Destination: {arrivalStop}</Text>
      {/* <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faInfoCircle} color="#0e766f" />
        <Text style={nextStopStyles.text}>Arriving in {duration}</Text>
      </View>
      <View style={nextStopStyles.infoRow}>
        <FontAwesomeIcon icon={faClock} color="#0e766f" />
        <Text style={nextStopStyles.text}>
          You will receive alerts as you get closer
        </Text>
      </View> */}
      <TouchableOpacity style={nextStopStyles.button}>
        <FontAwesomeIcon icon={faHandPointer} color="#ffffff" />
        <Text style={nextStopStyles.buttonText}>I need assistance!</Text>
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

function RouteSummary({ departureStop, arrivalStop, lineName, currentStep, parsed_route }) {
  const progress = ((currentStep?.step_number / parsed_route?.length) * 100) || 50;

  return (
    <View style={routeSummaryStyles.container}>
      <View style={styles.currentJourneyContainer}>
        <FontAwesomeIcon icon={faMapMarkerAlt} color="#ffffff" />
        <View style={styles.journeyTextContainer}>
          <Text style={styles.stepText}>Step {currentStep?.step_number} of {parsed_route?.length}</Text>
          <Text style={routeSummaryStyles.text}>Current Journey</Text>
          <Text style={styles.journeySubText}>
            Bus {lineName} from {departureStop} to {arrivalStop}
          </Text>
        </View>
      </View>
      <View style={styles.locationInfoContainer}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>Current Location</Text>
          <Text style={styles.locationText}>Next Location</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.completedProgress, { width: `${progress}%` }]} />
          <View
            style={[styles.remainingProgress, { width: `${100 - progress}%` }]}
          />
          <View style={[styles.busIconContainer, { left: `${progress}%` }]}>
            <View style={styles.busIcon}>
              <FontAwesomeIcon icon={faBus} color="#0e766f" size={12} />
            </View>
          </View>
        </View>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>{currentStep?.step_number - 1 || 0} steps completed</Text>
          <Text style={styles.locationText}>{parsed_route?.length - currentStep?.step_number || 0} steps remaining</Text>
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
  stepText: {
    color:'#ffffff',
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  repeatButton: {
    backgroundColor: "#0e766f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  repeatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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