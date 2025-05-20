import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LandingPage from "./Components/LandingPage";
import BusRoutePage from "./Components/BusRoutePage";
import WalkingRoutePage from "./Components/WalkingRoutePage";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import JourneyOrchestrator from "./Components/JourneyOrchestrator";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen 
          name="LandingPage" 
          component={LandingPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BusRoutePage" 
          component={BusRoutePage}
          options={{ headerShown: false }}
          
        />
         <Stack.Screen 
          name="WalkingRoutePage" 
          component={WalkingRoutePage}
          options={{ headerShown: false }}
          
        />
         <Stack.Screen 
          name="JourneyOrchestrator" 
          component={JourneyOrchestrator}
          options={{ headerShown: false }}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
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
