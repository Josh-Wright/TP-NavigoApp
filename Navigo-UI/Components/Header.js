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
import Svg, { Path } from "react-native-svg";

export default function Header() {
  return (
    <>
      <View style={styles.header}>
        <Image
          source={require("../assets/erasebg-transformed (3).png")}
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => alert("Help button pressed")}
        >
          <Svg width="16" height="16" viewBox="0 0 640 512">
            <Path
              fill="#ffffff"
              d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
            />
          </Svg>
          <Text style={{ marginLeft: 15, color: "#FFFFFF" }}>Help  </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      padding: 20,
      backgroundColor: "#0e766f",
    },
    logo: {
      marginTop: 20,
      width: 120,
      height: 40,
    },
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
