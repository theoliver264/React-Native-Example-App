import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, BackHandler } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Camera } from "expo-camera";
import Constants from "expo-constants";

export default function PhotoCamera({ onClose, setPhoto }) {
  const [hasPermission, setHasPermission] = useState(null);
  const type = useState(Camera.Constants.Type.back);
  let cameraRef = null;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      onClose()
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

  function onPictureSaved(photo) {
    setPhoto(photo.uri);
    onClose();
  }
  return (
    <Camera style={styles.camera} ref={(ref) => (cameraRef = ref)} ta>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="arrow-left"
          color="white"
          size={20}
          style={styles.button}
          onPress={() => onClose()}
        ></IconButton>
      </View>
      <IconButton
        icon="camera"
        color="white"
        size={32}
        style={styles.buttonCamera}
        onPress={async () => {
          if (cameraRef) {
            await cameraRef.takePictureAsync({
              onPictureSaved: onPictureSaved,
            });
          }
        }}
      ></IconButton>
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
  buttonCamera: {
    flex: 0.1,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 64,
    width: 72,
    height: 72,
    padding: 0,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
