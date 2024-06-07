import { Button, FocusAwareStatusBar } from "@/ui";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  if (!permission) {
    return (
      <View>
        <Stack.Screen options={{ headerShown: false }} />
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <>
        <FocusAwareStatusBar />
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-md ml-6 mt-4 font-semibold">
            We need your permission to show the camera
          </Text>
          <Button
            variant="primary"
            onPress={requestPermission}
            label="Grant Permission"
          />
        </View>
      </>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const fileName = `${FileSystem.documentDirectory}photo_${Date.now()}.jpg`;

      try {
        await FileSystem.moveAsync({
          from: photo?.uri as any,
          to: fileName,
        });

        // Store the photo data in AsyncStorage
        await AsyncStorage.setItem("capturedPhoto", fileName);
        console.log("Photo saved to", fileName);
      } catch (e) {
        console.log("Error saving photo", e);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 justify-center items-center p-6">
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />
        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <Text style={styles.captureButtonText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
