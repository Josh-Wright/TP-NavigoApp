import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Svg, { Path } from "react-native-svg";
import axios from "axios"; 
import Header from "./Header";

function InputField({ label, placeholder, value, onChangeText }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={{ fontWeight: "bold", marginTop: 12 }}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.microphoneButton}
          onPress={() => alert("Listening...")}
        >
          <Icon name="microphone" size={15} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ActionButton({ label, style, onPress, children }) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.buttonContent}>
        {children}
        <Text
          style={[
            styles.buttonText,
            style?.textColor && { color: style.textColor },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function LocationBox({
  label,
  iconName,
  iconColour,
  iconBackgroundColour,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.locationBox} onPress={onPress}>
      <View
        style={[styles.iconWrapper, { backgroundColor: iconBackgroundColour }]}
      >
        <Icon name={iconName} size={20} color={iconColour} />
      </View>
      <Text style={styles.locationText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LandingPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRouteInfo = async () => {
    if (!origin || !destination) {
      Alert.alert("Error", "Please enter both origin and destination");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        "http://10.135.26.3:5000/api/getRouteInfo",
        {
          params: {
            origin: origin,
            destination: destination,
            mode: "transit",
          },
        }
      );

      const data = response.data;

      if (data.status === "success") {
        const routeInfo = data.data;
        Alert.alert(
          "Route Information",
          `From: ${routeInfo.origin.address}\n` +
            `To: ${routeInfo.destination.address}\n` +
            `Duration: ${routeInfo.duration}\n` +
            `Distance: ${routeInfo.distance}\n` +
            `Steps: ${routeInfo.steps.length} steps in your journey`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to get route information");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to connect to the server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    if (!origin) {
      setOrigin(location);
    } else {
      setDestination(location);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header/>
      

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Plan your journey</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <InputField
          label="From:"
          placeholder="Current location"
          value={origin}
          onChangeText={setOrigin}
        />
        <InputField
          label="To:"
          placeholder="Where would you like to go?"
          value={destination}
          onChangeText={setDestination}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>When do you want to travel?</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <ActionButton
            label={isLoading ? "Loading..." : "Depart Now"}
            style={styles.primaryButton}
            onPress={fetchRouteInfo}
            disabled={isLoading}
          >
            <Svg
              style={{ marginEnd: 15 }}
              width="16"
              height="16"
              viewBox="0 0 512 512"
            >
              <Path
                fill="#ffffff"
                d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120v136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
              />
            </Svg>
          </ActionButton>
          <ActionButton
            label="Schedule"
            style={{ ...styles.secondaryButton, textColor: "#0F3D3E" }}
            onPress={() => alert("Scheduling trip!")}
          >
            <Svg
              style={{ marginEnd: 15 }}
              width="16"
              height="16"
              viewBox="0 0 448 512"
            >
              <Path
                fill="#0e766f"
                d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v40H64c-35.3 0-64 28.7-64 64v16v48v256c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V192v-48v-16c0-35.3-28.7-64-64-64h-40V24c0-13.3-10.7-24-24-24s-24 10.7-24 24v40H152V24zM48 192h352v256c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"
              />
            </Svg>
          </ActionButton>
        </View>

        <View style={styles.instructionContainer}>
          <TouchableOpacity onPress={() => alert("Listening...")}>
            <View style={styles.microphoneIcon}>
              <Icon name="microphone" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text>Listening... Say your journey</Text>
        </View>
      </View>

      {/* Save Locations */}
      <View style={styles.sectionHeader}>
        <Text style={styles.titleText}>Saved Locations</Text>
      </View>

      <View style={styles.savedLocationsContainer}>
        <LocationBox
          label="Home"
          iconName="home"
          iconColour="#3a74ec"
          iconBackgroundColour="#dbeafe"
          onPress={() => handleLocationSelect("Home")}
        />
        <LocationBox
          label="Work"
          iconName="briefcase"
          iconColour="#eb5d12"
          iconBackgroundColour="#ffecd4"
          onPress={() => handleLocationSelect("Work")}
        />
        <LocationBox
          label="Hospital"
          iconName="hospital-o"
          iconColour="#de3c3d"
          iconBackgroundColour="#fbd0d0"
          onPress={() => handleLocationSelect("Hospital")}
        />
        <LocationBox
          label="University"
          iconName="graduation-cap"
          iconColour="#09966a"
          iconBackgroundColour="#afe9d0"
          onPress={() => handleLocationSelect("University")}
        />
      </View>

      <View style={styles.voiceHint}>
        <Text style={styles.voiceHintText}>
          double tap anywhere to activate voice control..
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "",
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#0e766f",
    position: "absolute",
    top: 0,
    left: 0,
  },
  logo: {
    marginTop: 20,
    width: 120,
    height: 40,
  },
  titleContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginTop: 80,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#000000",
  },
  content: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    marginBottom: 20,

    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  microphoneButton: {
    marginLeft: 10,
    backgroundColor: "#0c9489",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  microphoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0c9489",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  microphoneText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: "#0c9489",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0e766f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0e766f",
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "#f0fcfb",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedLocationsContainer: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },

  locationBox: {
    flexDirection: "row",
    width: "48%",
    height: 50,
    borderWidth: 1,
    borderColor: "#0e766f",
    alignItems: "center",

    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  locationText: {
    color: "#0e766f",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  iconWrapper: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, 
  },
  voiceHintText: { fontSize: 16, color: "grey" },
  helpButton: {
    flexDirection: "row",
    backgroundColor: "#0c9588",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
