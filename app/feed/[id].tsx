import { Link, Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";

import {
  ActivityIndicator,
  FocusAwareStatusBar,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "@/ui";
import { Notifications } from "@/ui/icons/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const EmptyState = require("../../assets/emptyState.svg");

export default function Post() {
  const local = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      await publishProduct(productId as string);
      alert("Product published successfully");
    } catch (error) {
      console.error("Failed to publish product:", error);
      alert("Failed to publish product");
    } finally {
      setLoading(false);
    }
  };

  const productId = local?.id;

  const [productData, setProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await getSingleProduct(productId as string);
        const data = await response.json();
        setProductData(data);
        setIsError(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  console.log(productData);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen
          options={{
            title: "Detail Product",
            headerBackTitleVisible: false,
            headerTintColor: "#2A2661",
            headerRight: () => <CreateNewPostLink />,
          }}
        />
        <FocusAwareStatusBar />
        <View className="flex-1 justify-center items-center p-6">
          <View className="h-36 w-36">
            <Image
              source={EmptyState}
              className="h-full w-full overflow-hidden"
            />
          </View>
          <Text> Product Not Available </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="bg-white h-full">
      <Stack.Screen
        options={{
          title: "Detail Product",
          headerBackTitleVisible: false,
          headerTintColor: "#2A2661",
          headerTitleAlign: "center",
        }}
      />
      <View className="px-4 pt-6">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80",
          }}
          className="w-full h-72 my-4"
        />
        <Text className="text-xl font-semibold">
          {productData?.data?.title.slice(0, 30)}
        </Text>
        <Text className="text-red-600 text-2xl font-bold">
          $ {productData?.data?.price}
        </Text>
        <View className="flex-row items-center my-2">
          <Text className="text-yellow-500">⭐ 4.6</Text>
          <Text className="ml-2 text-gray-500">86 Reviews</Text>
          <Text className="ml-auto text-green-600">Tersedia : 250</Text>
        </View>
        <View className="flex-row items-center my-2">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80",
            }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="ml-2 font-semibold">Shop Larson Electronic</Text>
          <View className="ml-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
        </View>
        <Text className="text-lg font-semibold mt-4">Description Product</Text>
        <Text className="text-gray-700 mt-2">
          {productData?.data?.description}
        </Text>
        <TouchableOpacity
          className="bg-[#2A2661]  mt-4 py-3 rounded-lg flex items-center justify-center"
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Publish
            </Text>
          )}
        </TouchableOpacity>
        <Text className="text-lg font-semibold mt-6">Review (86)</Text>
        <View className="flex-row items-center mt-4">
          <Image
            source={{ uri: "https://example.com/reviewer-1.png" }} // Replace with reviewer image URL
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-2">
            <Text className="font-semibold">Yelena Belova</Text>
            <Text className="text-gray-500 text-xs">2 Minggu yang lalu</Text>
          </View>
          <Text className="ml-auto text-yellow-500">⭐ 4</Text>
        </View>
        <Text className="text-gray-700 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        {/* Repeat above block for other reviews */}
        <TouchableOpacity className="bg-gray-200 mt-4 py-3 rounded-lg">
          <Text className="text-center font-semibold">See All Reviews</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable className="mr-10">
        <Notifications />
      </Pressable>
    </Link>
  );
};

async function getSingleProduct(productId: string) {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl = `https://snaplist-tdfh.onrender.com/api/v1/inventory/${productId}`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(apiUrl, options);
}

async function publishProduct(productId: string) {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl = `https://snaplist-tdfh.onrender.com/api/v1/inventory/${productId}/publish`;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(apiUrl, options);
}
