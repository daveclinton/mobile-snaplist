import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { client } from "../common/client";

type Response = any;
type Variables = void;

export const useInventory = createQuery<Response, Variables, AxiosError>({
  queryKey: ["data"],
  fetcher: () => {
    return client.get(`/inventory`).then((response) => response.data.data);
  },
});

export const useSingleProduct = createQuery<Response, Variables, AxiosError>({
  queryKey: ["data"],
  fetcher: (product_id) => {
    return client.get(`inventory/${product_id}`).then((response) => {
      return response.data;
    });
  },
});
