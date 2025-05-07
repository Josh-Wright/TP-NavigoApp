import Header from "./Header";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function BusRoutePage() {
  return (
    <View style={styles.container}>
      <Header />
      <RouteSummary />
    </View>
  );
}

function RouteSummary() {
  return (
    <View style={routeSummaryStyles.container}>
      <View style={styles.currentJourneyContainer}>
        {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
        <Svg viewBox="0 0 384 512" width={16} height={16} fill="#ffffff">
          <Path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
        </Svg>
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
        <View
          style={styles.journeyProgressBar}
        ></View>
        <View style={styles.locationHeader}>
          <Text style={styles.locationText}>2 stops passed</Text>
          <Text style={styles.locationText}>2 stops remaining</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  currentJourneyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  journeyTextContainer: {
    marginLeft: 10,
  },
  journeyProgressBar: {
    height: 15,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginVertical: 10,
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
