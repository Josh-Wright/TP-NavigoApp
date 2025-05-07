import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Svg, { Circle, Rect, Path } from "react-native-svg";

function InputField({ label, placeholder }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={{ fontWeight: "bold", marginTop: 12 }}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder={placeholder} />
        <TouchableOpacity
          style={styles.microphoneButton}
          onPress={() => alert("Listening...")}
        >
          <Icon
            name="microphone"
            size={15}
            style={styles.microphoneText}
            color="#ffffff"
          />
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

function LocationBox({ label, iconName,iconColour,iconBackgroundColour }) {
  return (
    <TouchableOpacity
      style={styles.locationBox}
      onPress={() => alert(`${label} selected!`)}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColour }]}>
  <Icon name={iconName} size={20} color={iconColour} />
</View>


      <Text style={styles.locationText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LandingPage() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/erasebg-transformed (3).png")}
          style={styles.logo}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#0c9588",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 24,
            marginLeft: "auto",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
          onPress={() => alert("This coursework is driving me nuts")}
        >
          <Svg width="16" height="16" viewBox="0 0 640 512">
            <Path
              fill="#ffffff"
              d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
            />
          </Svg>
          <Text style={{ marginLeft: 15, color: "#FFFFFF" }}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Plan your journey</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <InputField label="From:" placeholder="Current location" />
        <InputField label="To:" placeholder="Where would you like to go?" />

        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            marginTop: 5,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            When do you want to travel?
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <ActionButton
            label="Depart Now"
            style={styles.primaryButton}
            onPress={() => alert("Departing now!")}
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

        {/* Voice Instruction */}
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
      <View
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: 10,
          marginTop: 12,
        }}
      >
        <Text style={styles.titleText}>Saved Locations</Text>
      </View>

      <View style={styles.savedLocationsContainer}>
        <LocationBox label="Home" iconName="home" iconColour={"#3a74ec"} iconBackgroundColour={"#dbeafe"}/>
        <LocationBox label="Work" iconName="briefcase" iconColour ={"#eb5d12"} iconBackgroundColour={"#ffecd4"}/>
        <LocationBox label="Hospital" iconName="hospital-o" iconColour={"#de3c3d"} iconBackgroundColour={"#fbd0d0"}/>
        <LocationBox label="University" iconName="graduation-cap" iconColour ={"#09966a"} iconBackgroundColour={"#afe9d0"} />
      </View>
      <View
          style={{
            
            alignSelf: "center",
            paddingHorizontal: 10,
            marginTop: 15,
          }}
        >
          <Text style={{ fontSize: 16, color:'grey'}}>
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
    borderRadius: 15, // Ensures rounding
  },
  
});
