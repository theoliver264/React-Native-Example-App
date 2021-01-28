import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, BackHandler } from "react-native";
import { Button } from "react-native-paper";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import { useHistory } from "react-router-native";

export default function Scanner({ onClose, onBarCodeScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const history = useHistory();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onClose
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Camera
      style={styles.camera}
      type={type}
      onBarCodeScanned={({ type, data }) => onBarCodeScanned(data)}
      ratio="4:3"
    >
      <View style={styles.buttonContainer}>
        <Button
          icon="arrow-left"
          style={styles.button}
          onPress={() => onClose()}
        ></Button>
      </View>
    </Camera>
  );
}
const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    marginTop: 64,
    marginLeft: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
