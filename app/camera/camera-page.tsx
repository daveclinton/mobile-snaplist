import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function CameraPage() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const cameraRef = useRef<any | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function captureImage() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImageUri(photo.uri);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={captureImage}
          />
        </View>
      </CameraView>
      {capturedImageUri && <OtherPage imageUri={capturedImageUri} />}
    </View>
  );
}

const OtherPage = ({ imageUri }: { imageUri: string }) => {
  return <Image source={{ uri: imageUri }} style={{ flex: 1 }} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignSelf: "flex-end",
    marginBottom: "20%",
  },
});
