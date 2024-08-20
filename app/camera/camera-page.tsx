import { Button } from "@/ui/button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { View, Text } from "@/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";
import { SmallCancel } from "@/ui/icons/cancel-icon";
import { showMessage } from "react-native-flash-message";
import ProductItem from "@/components/Porduct-Item";
import CameraRoll from "@/components/camera-roll";
import { uploadImageAsync } from "@/api/ImagePicker";

export default function CameraPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const cameraRef = useRef<any | null>(null);
  const router = useRouter();
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
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <View className="justify-center bg-amber-100"></View>
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleImageCapture}
              />
              <Text className="text-white font-bold">
                Search with your camera
              </Text>
            </View>
          </View>
        </CameraView>
        <CameraRoll />
      </View>
      {isPending ? (
        <Loader />
      ) : capturedImageUri && uploadResponseData === null ? (
        <View className="flex-1 justify-center p-6">
          <View className="flex justify-end items-end mb-2">
            <TouchableOpacity
              onPress={() => {
                setCapturedImageUri(null);
              }}
            >
              <SmallCancel />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: capturedImageUri }} style={{ flex: 1 }} />
          <Button onPress={handleImageUpload} label="Upload Image" />
        </View>
      ) : uploadResponseData !== null ? (
        <View className="flex-1 p-6">
          <View className="flex justify-end items-end mb-2">
            <TouchableOpacity
              onPress={() => {
                setUploadResponseData(null);
                setCapturedImageUri(null);
              }}
            >
              <SmallCancel />
            </TouchableOpacity>
          </View>
          {uploadResponseData && (
            <FlatList
              data={uploadResponseData.image_results}
              keyExtractor={(item, index) => item.position || index.toString()}
              renderItem={({ item }) => (
                <ProductItem key={item.position} {...item} />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 0.5,
    width: "100%",
    borderRadius: 6,
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
