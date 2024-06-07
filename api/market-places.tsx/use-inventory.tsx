import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { client } from "../common/client";
import { useQuery } from "@tanstack/react-query";

type Response = any;
type Variables = void;

export const useInventory = createQuery<Response, Variables, AxiosError>({
  queryKey: ["data"],
  fetcher: () => {
    return client.get(`/inventory`).then((response) => response.data.data);
  },
});

export const useSingleProduct = createQuery<Response, any, AxiosError>({
  queryKey: ["data"],
  fetcher: (productId) => {
    return client.get(`inventory/${productId}`).then((response) => {
      return response.data;
    });
  },
});
