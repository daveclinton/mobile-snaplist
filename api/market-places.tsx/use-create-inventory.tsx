import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";

type Response = any;

export const useCreateInventory = createMutation<Response, any, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: "/inventory/create",
      method: "POST",
      data: variables,
    }).then((response) => {
      return response?.data;
    });
  },
});
