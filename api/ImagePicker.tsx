import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "./common/client";

export async function pickImage() {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
}

export async function uploadImageAsync(uri: string) {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl = `${baseUrl}inventory/image/upload`;
  const uriArray = uri.split(".");
  const fileType = uriArray[uriArray.length - 1];
  const response = await fetch(uri);
  const blob = await response.blob();
  const imageSizeInMB = blob.size / (1024 * 1024);
  if (imageSizeInMB > 10) {
    alert("Image size exceeds 10 MB");
    throw new Error("Image exceed 10 MB");
  }
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
