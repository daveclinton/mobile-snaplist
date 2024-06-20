import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const client = axios.create({
  baseURL: "https://snaplist-tdfh.onrender.com/api/v1",
  // baseURL: "https://348e-102-135-169-124.ngrok-free.app/api/v1",
  // baseURL: "https://ed3b-102-135-169-125.ngrok-free.app/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config) => {
    const userData = await AsyncStorage.getItem("user-data");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("user-data");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const isValidToken = (token: any) => {
  return !!token;
};

export const isAuthenticated = async () => {
  const userData = await getUserData();
  if (!userData) {
    return false;
  }
  const { access_token: token } = userData;
  return isValidToken(token);
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("user-data");
    console.log("User data removed from AsyncStorage");
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

// export const baseUrl = "https://ed3b-102-135-169-125.ngrok-free.app/api/v1/";
export const baseUrl = "https://snaplist-tdfh.onrender.com/api/v1/";
