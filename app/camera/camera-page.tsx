import { Button } from "@/ui/button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useState, useRef, JSX } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { View, Text } from "@/ui";
import { ImagesRoll } from "@/ui/icons/images";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";
import { CancelIcon, SmallCancel } from "@/ui/icons/cancel-icon";
import { showMessage } from "react-native-flash-message";
import ProductItem from "@/components/Porduct-Item";

export const createFormData = (uri: string): FormData => {
  const fileName = uri.split("/").pop() || "";
  const fileType = fileName.split(".").pop() || "";
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  } as any);

  return formData;
};

export default function CameraPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const cameraRef = useRef<any | null>(null);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [uploadResponseData, setUploadResponseData] = useState<any>(null);

  if (uploadResponseData?.image_results) {
    console.log(uploadResponseData.image_results[0]);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setCapturedImageUri(imageUri);
      await AsyncStorage.setItem("capturedPhoto", imageUri);
    }
  };

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
      setUploadResponseData(responseData.data);
      // await AsyncStorage.setItem(
      //   "uploadResponseData",
      //   JSON.stringify(responseData.data)
      // );
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
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Camera",
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleCancel} className="ml-10">
              <CancelIcon />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View className="justify-center bg-amber-100">
            <Text className="text-lg text-center  align-middle">
              TAP SHUTTER BUTTON TO SEARCH
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={pickImage}>
              <ImagesRoll />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleImageCapture}
            />
          </View>
        </View>
      </CameraView>
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

async function uploadImageAsync(uri: string) {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl =
    "https://snaplist-tdfh.onrender.com/api/v1/inventory/image/upload";
  const uriArray = uri.split(".");
  const fileType = uriArray[uriArray.length - 1];
  const formData = new FormData();
  formData.append("image", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  } as any);

  const options = {
    method: "POST",
    body: formData,
    mode: "cors" as RequestMode,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(apiUrl, options);
}
