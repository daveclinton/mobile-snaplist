import { Button } from "@/ui/button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useState, useRef } from "react";
import { StyleSheet, Alert, Pressable } from "react-native";
import { View, Text } from "@/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import CameraRoll from "@/components/camera-roll";
import { uploadImageAsync } from "@/api/ImagePicker";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";

export default function CameraPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const cameraRef = useRef<any | null>(null);
  const router = useRouter();
  const [fullCamera, setFullCamera] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false);
  const [uploadResponseData, setUploadResponseData] = useState<any>(null);

  if (!permission || !permission.granted) {
    return (
      <View className="flex-1 justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} label="Grant permission" />
      </View>
    );
  }

  const handleCancel = () => {
    Alert.alert("Exit Camera", "Are you sure you want to exit the camera?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Exit",
        onPress: () => {
          setCapturedImageUri(null);
          router.push("/list-item");
        },
      },
    ]);
  };

  const handleImageCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImageUri(photo.uri);
    }
  };

  const handleImageUpload = async () => {
    try {
      setIsPending(true);
      const response = await uploadImageAsync(capturedImageUri as string);
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const responseData = await response.json();
      await AsyncStorage.setItem(
        "capturedPhoto",
        responseData?.data?.search_parameters?.image_url
      );
      setUploadResponseData(responseData.data);
      showMessage({
        message: "Image uploaded successfully!",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: "Failed to upload image. Please try again.",
        type: "danger",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <View className="flex-1 items-center py-5">
        <MotiView
          from={{
            height: fullCamera ? "50%" : "90%",
            width: "100%",
            borderRadius: fullCamera ? 20 : 0,
          }}
          animate={{
            height: fullCamera ? "90%" : "50%",
            width: "100%",
            borderRadius: fullCamera ? 0 : 20,
          }}
          transition={{ type: "timing", duration: 300 }}
        >
          <CameraView
            style={fullCamera ? styles.fullCamera : styles.camera}
            facing="back"
            ref={cameraRef}
          >
            <View style={styles.buttonContainer}>
              <View className="flex-row mt-10 justify-between">
                <Pressable
                  onPress={() => {
                    handleCancel();
                  }}
                >
                  <Feather name="x" size={24} color="white" />
                </Pressable>
                <Text className="text-white font-bold">Snaplist Lens</Text>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color="white"
                />
              </View>
              {!fullCamera ? (
                <View className={`flex-1 items-center justify-center`}>
                  <Pressable
                    onPress={() => {
                      setFullCamera(!fullCamera);
                    }}
                    className="w-[60px] h-[60px] bg-transparent border-lime-100 border-2 justify-center items-center rounded-full"
                  >
                    <Feather name="camera" size={24} color="white" />
                  </Pressable>
                  <Text className="text-white mt-5 font-bold">
                    Search with your camera
                  </Text>
                </View>
              ) : (
                <View className="flex-1 justify-end items-center mb-10">
                  <Pressable
                    onPress={() => {
                      setFullCamera(!fullCamera);
                    }}
                    className="w-[60px] h-[60px] bg-transparent border-lime-100 border-2 justify-center items-center rounded-full"
                  >
                    <Feather name="camera" size={24} color="white" />
                  </Pressable>
                </View>
              )}
            </View>
          </CameraView>
        </MotiView>

        {!fullCamera && <CameraRoll />}
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
    flex: 0.9,
    width: "100%",
    borderRadius: 15,
  },
  fullCamera: {
    flex: 0.9,
    width: "100%",
    borderRadius: 20,
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
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: "10%",
    marginHorizontal: "auto",
    marginTop: 10,
  },
});
