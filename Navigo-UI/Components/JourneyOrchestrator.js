import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import WalkingRoutePage from "./WalkingRoutePage";
import BusRoutePage from "./BusRoutePage";
import Header from "./Header";

export default function JourneyOrchestrator({ route }) {
  const { parsed_route, transitDetails, transitStops, origin, destination } = route.params || {};
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!parsed_route || parsed_route.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <Text>No route data available.</Text>
      </View>
    );
  }

  const currentStep = parsed_route[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < parsed_route.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      alert("Journey completed!");
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>Step {currentStep.step_number} of {parsed_route.length}</Text>
        {currentStep.type === "walking" ? (
          <WalkingRoutePage
            step={currentStep}
            origin={origin}
            destination={destination}
            onNextStep={handleNextStep}
          />
        ) : (
          <BusRoutePage
            step={currentStep}
            transitDetails={transitDetails}
            transitStops={transitStops}
            origin={origin}
            destination={destination}
            onNextStep={handleNextStep}
          />
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepContainer: {
    flex: 1,
   
  },
  stepText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#0e766f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});