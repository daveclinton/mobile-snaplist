import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";

type Response = any;

export const useImageSearch = createMutation<Response, any, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: "/inventory/image/upload",
      method: "POST",
      data: variables,
    }).then((response) => {
      return response?.data;
    });
  },
});
