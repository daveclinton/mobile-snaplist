import { Button } from "@/ui/button";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { View, Text } from "@/ui";

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
          <View className="justify-center bg-amber-100">
            <Text className="text-lg text-center  align-middle">
              TAP SHUTTER BUTTON TO SEARCH
            </Text>
          </View>
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
  return (
    <View className="flex-1 justify-center p-6">
      <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
      <Button onPress={() => {}} label="Search" />
    </View>
  );
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
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    borderRadius: 20,
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
    marginBottom: "10%",
    marginHorizontal: "auto",
    marginTop: 10,
  },
});
