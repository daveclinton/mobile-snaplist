import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
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
import { baseUrl } from "@/api/common/client";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { Alert, Platform, ToastAndroid } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

const EmptyState = require("../../assets/emptyState.svg");

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

export default function Post() {
  const local = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const colorMode = "light";
  const productId = local?.id;
  const [productData, setProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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

  const handlePublish = async () => {
    setLoading(true);
    try {
      await publishProduct(productId as string);
      await fetchProduct();
    } catch (error) {
      console.error("Failed to publish product:", error);
      alert("Failed to publish product");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await delistProduct(productId as string);
      await fetchProduct();
      router.replace("/");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  console.log(productData);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const ebayLink = `https://www.sandbox.ebay.com/itm/${productData?.data?.ebay_listing_id}`;
  if (isLoading) {
    return (
      <MotiView
        transition={{
          type: "timing",
        }}
        className="flex-1  p-5"
        animate={{ backgroundColor: "#ffffff" }}
      >
        <Skeleton colorMode={colorMode} width="100%" height={150} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={20} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} radius="round" height={75} width={75} />
        <Skeleton colorMode={colorMode} width={100} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={150} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width="100%" />
      </MotiView>
    );
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
            uri: productData?.data?.image_urls[0],
          }}
          className="w-full h-72 my-4"
        />
        <Text className="text-xl font-semibold">
          {productData?.data?.title.slice(0, 30)}
        </Text>
        <Text className="text-red-600 text-2xl font-bold">
          $ {productData?.data?.price}
        </Text>
        <View className="flex-row items-center justify-between my-2">
          <Text className="ml-2 text-gray-500 font-bold">
            MarketPlace: {productData?.data?.marketplace_name}
          </Text>
          {productData?.data?.status === "ACTIVE" &&
            productData?.data?.marketplace_name === "Facebook" && (
              <Pressable
                onPress={() => {
                  Clipboard.setStringAsync(
                    "https://business.facebook.com/commerce/catalogs/3732230713722239/products/?business_id=383394360932309"
                  )
                    .then(() => {
                      if (Platform.OS === "android") {
                        ToastAndroid.show(
                          "Link copied to clipboard",
                          ToastAndroid.SHORT
                        );
                      } else {
                        Alert.alert("Success", "Link copied to clipboard");
                      }
                    })
                    .catch((error) => {
                      console.error("Failed to copy link:", error);
                      Alert.alert("Error", "Failed to copy link");
                    });
                }}
              >
                <Text className="ml-auto text-green-600">
                  Copy Link
                  <Ionicons name="copy-outline" size={14} color="#16a34a" />
                  {` or `}
                  <Link
                    href={
                      "https://business.facebook.com/commerce/catalogs/3732230713722239/products/?business_id=383394360932309"
                    }
                  >
                    <Text>Visit </Text>
                    <EvilIcons name="external-link" size={14} color="#16a34a" />
                  </Link>
                </Text>
              </Pressable>
            )}
          {productData?.data?.ebay_listing_id && (
            <Pressable
              onPress={() => {
                Clipboard.setStringAsync(ebayLink)
                  .then(() => {
                    if (Platform.OS === "android") {
                      ToastAndroid.show(
                        "Link copied to clipboard",
                        ToastAndroid.SHORT
                      );
                    } else {
                      Alert.alert("Success", "Link copied to clipboard");
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to copy link:", error);
                    Alert.alert("Error", "Failed to copy link");
                  });
              }}
            >
              <Text className="ml-auto text-green-600">
                Copy Link
                <Ionicons name="copy-outline" size={14} color="#16a34a" />
                {` or `}
                <Link href={ebayLink}>
                  <Text>Visit </Text>
                  <EvilIcons name="external-link" size={14} color="#16a34a" />
                </Link>
              </Text>
            </Pressable>
          )}
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
          className={` ${
            productData?.data?.status === "DRAFT"
              ? "bg-[#2A2661]"
              : "bg-[#D16666]"
          } mt-4 py-3 rounded-lg flex items-center justify-center`}
          onPress={
            productData?.data?.status === "DRAFT" ? handlePublish : handleDelete
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              {productData?.data?.status === "ACTIVE" ? "De List" : "Publish"}
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
  const apiUrl = `${baseUrl}inventory/${productId}`;
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
  const apiUrl = `${baseUrl}inventory/${productId}/publish`;
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    console.log("Published response", data);
    return data;
  } catch (error) {
    console.log(error);
    console.error("Failed to publish product:", error);
    throw new Error("Failed to publish product");
  }
}

async function delistProduct(productId: string) {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl = `${baseUrl}inventory/${productId}/delete`;
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    console.error("Failed to publish product:", error);
    throw new Error("Failed to publish product");
  }
}
