import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError, type AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";

type Variables = {
  username: string;
  password: string;
};

const USER_DATA_KEY = "user-data";

export const useLogin = createMutation<any, Variables, AxiosError>({
  mutationFn: async (variables) => {
    try {
      const response = await client.post<any>("/login", variables);
      const { data } = response;
      if (data && data.data) {
        const userData = JSON.stringify(data.data);
        await AsyncStorage.setItem(USER_DATA_KEY, userData);
      } else {
        throw new Error(response?.data?.message);
      }
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  },
});
