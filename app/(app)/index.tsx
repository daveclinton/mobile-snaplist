import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { useRouter } from "expo-router";
import { FocusAwareStatusBar, Image, Text, TouchableOpacity, View } from "@/ui";
import { MenuIcon } from "@/ui/icons/menu";
import { Searchbar } from "react-native-paper";

import ProductCard from "@/components/Product-Card";
import { baseUrl } from "@/api/common/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

const Maercari = require("../../assets/mercari.svg");
const Facebook = require("../../assets/facebook.svg");
const Ebay = require("../../assets/ebay.svg");
const EmptyState = require("../../assets/emptyState.svg");

interface Product {
  product_id: string;
  title: string;
  created_at: string;
  marketplace_name: string;
}

interface PlatformIconProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onPress: () => void;
}

interface EmptyStateViewProps {
  onAddNewProduct: () => void;
}

type MarketplaceName = "All" | "Ebay" | "Facebook" | "Mercari";

const Spacer: React.FC<{ height?: number }> = ({ height = 16 }) => (
  <View style={{ height }} />
);
const MemoizedProductCard = React.memo(ProductCard);

const ITEM_HEIGHT = 150;

const Feed: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const colorMode = "light";
  const [isError, setIsError] = useState<boolean>(false);
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] =
    useState<MarketplaceName>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedPlatform === "All" ||
          item.marketplace_name === selectedPlatform)
    );
  }, [data, searchQuery, selectedPlatform]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllProducts();
      const result = await response.json();
      setData(result?.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNewProduct = useCallback(() => {
    router.push("/camera/camera-roll");
  }, [router]);

  const renderProductCard = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => {
      return <MemoizedProductCard item={item} />;
    },
    []
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const handlePlatformPress = useCallback((platform: MarketplaceName) => {
    setSelectedPlatform(platform);
  }, []);

  if (isError) {
    return (
      <>
        <FocusAwareStatusBar />
        <View className="flex-1 justify-center items-center p-6">
          <View className="h-36 w-36">
            <Image
              source={EmptyState}
              className="h-full w-full overflow-hidden"
            />
          </View>
          <Text>Error Fetching Products</Text>
        </View>
        <View className="absolute bottom-10 right-5">
          <TouchableOpacity
            className="bg-[#2A2661] px-4 py-3 rounded-lg"
            onPress={handleRetry}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 justify-center p-6">
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <Text className="text-md ml-6 mt-4 font-semibold">Platforms</Text>
        <View className="mb-4 flex w-full flex-row justify-around">
          <PlatformIcon
            icon={<MenuIcon />}
            text="All"
            isActive={selectedPlatform === "All"}
            onPress={() => handlePlatformPress("All")}
          />
          <PlatformIcon
            icon={
              <Image source={Ebay} className="h-full w-full overflow-hidden" />
            }
            text="Ebay"
            isActive={selectedPlatform === "Ebay"}
            onPress={() => handlePlatformPress("Ebay")}
          />
          <PlatformIcon
            icon={
              <Image
                source={Facebook}
                className="h-full w-full overflow-hidden"
              />
            }
            text="Facebook"
            isActive={selectedPlatform === "Facebook"}
            onPress={() => handlePlatformPress("Facebook")}
          />
          <PlatformIcon
            icon={
              <Image
                source={Maercari}
                className="h-full w-full overflow-hidden"
              />
            }
            text="Mercari"
            isActive={selectedPlatform === "Mercari"}
            onPress={() => handlePlatformPress("Mercari")}
          />
        </View>

        {isLoading ? (
          <LoadingSkeleton colorMode={colorMode} />
        ) : filteredData.length === 0 ? (
          <EmptyStateView onAddNewProduct={handleAddNewProduct} />
        ) : (
          <FlatList
            data={filteredData.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.product_id.toString()}
            numColumns={2}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            windowSize={5}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            getItemLayout={getItemLayout}
          />
        )}
      </View>
    </>
  );
};

const PlatformIcon: React.FC<PlatformIconProps> = React.memo(
  ({ icon, text, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="justify-center mt-2 items-center"
    >
      <View
        className={`
        h-12 w-12 
        items-center justify-center 
        rounded-full shadow-lg shadow-white
        ${isActive ? "border-2 border-[#393392]" : ""}
      `}
      >
        {icon}
      </View>
      <Text className={`font-bold `}>{text}</Text>
    </TouchableOpacity>
  )
);

const LoadingSkeleton: React.FC<{ colorMode: "light" }> = React.memo(
  ({ colorMode }) => (
    <MotiView
      transition={{
        type: "timing",
      }}
      className="flex-1 items-center"
      animate={{ backgroundColor: "#ffffff" }}
    >
      <Skeleton colorMode={colorMode} width="100%" height={150} />
      <Spacer height={8} />
      <Skeleton colorMode={colorMode} width="100%" height={150} />
      <Spacer height={8} />
      <Skeleton colorMode={colorMode} width="100%" height={150} />
    </MotiView>
  )
);

const EmptyStateView: React.FC<EmptyStateViewProps> = React.memo(
  ({ onAddNewProduct }) => (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 justify-center items-center p-6">
        <View className="h-36 w-36">
          <Image
            source={EmptyState}
            className="h-full w-full overflow-hidden"
          />
        </View>
        <Text>No Products Added</Text>
      </View>
      <View className="absolute bottom-10 right-5">
        <TouchableOpacity
          className="bg-[#2A2661] px-4 py-3 rounded-lg"
          onPress={onAddNewProduct}
        >
          <Text className="text-white font-bold">Add New Product</Text>
        </TouchableOpacity>
      </View>
    </>
  )
);

async function getAllProducts(): Promise<Response> {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl = `${baseUrl}inventory`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(apiUrl, options);
}

export default Feed;
