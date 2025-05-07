import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LandingPage from "./Components/LandingPage";
import BusRoutePage from "./Components/BusRoutePage";

export default function App() {
  return (
    <>
     
      {/* <LandingPage /> */}
      <BusRoutePage />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
