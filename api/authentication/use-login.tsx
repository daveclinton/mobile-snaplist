import { isAxiosError, type AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";
import { storage, userObject } from "../storage";

type Variables = {
  username: string;
  password: string;
};

export const useLogin = createMutation<any, Variables, AxiosError>({
  mutationFn: async (variables) => {
    try {
      const response = await client.post<any>("/login", variables);
      const { data } = response;
      storage.set("userData", JSON.stringify(data.data));
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
