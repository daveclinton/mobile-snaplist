import { Button } from "@/ui/button";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";
import { View } from "@/ui";

export default function CameraPage() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const cameraRef = useRef<any | null>(null);
  const router = useRouter();

  if (!permission) {
    return (
      <View className="flex-1 justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} label="grant permission" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} label="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleCancel = () => {
    Alert.alert("Discard Image", "Are you sure you want to exit the camera?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Discard",
        onPress: () => {
          setCapturedImageUri(null);
          router.push("/list-item");
        },
      },
    ]);
  };

  async function captureImage() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImageUri(photo.uri);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Camera",
          headerTitleAlign: "center",
          headerRight: () => <Button onPress={handleCancel} label="Cancel" />,
        }}
      />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={captureImage}
          />
        </View>
      </CameraView>
      {capturedImageUri && <OtherPage imageUri={capturedImageUri} />}
    </>
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
