import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { client } from "../common/client";

type Response = any;
type Variables = void;

export const useMarketPlaces = createQuery<Response, Variables, AxiosError>({
  queryKey: ["data"],
  fetcher: () => {
    return client.get(`/marketplaces`).then((response) => response.data);
  },
});

export const useProfileData = createQuery<Response, Variables, AxiosError>({
  queryKey: [""],
  fetcher: () => {
    return client.get(`/profile`).then((response) => response.data.data);
  },
});

export const useCategories = createQuery<Response, Variables, AxiosError>({
  queryKey: ["data"],
  fetcher: () => {
    return client.get(`/inventory/products/categories`).then((response) => {
      response.data;
    });
  },
});

export const useBrands = createQuery<Response, Variables, AxiosError>({
  queryKey: ["data"],
  fetcher: () => {
    return client.get(`/brands`).then((response) => {
      response.data;
    });
  },
});
