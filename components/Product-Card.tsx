import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

const ProductCard = ({ item }: { [key: string]: any }) => {
  const {
    title = "Unknown Product",
    price = "Rp. 0",
    rating = 0,
    reviews = 0,
    image_urls = null,
    product_id,
  } = item;

  const defaultImage =
    "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80";

  return (
    <Link href={`/feed/${product_id}`} asChild>
      <Pressable className="w-1/2 p-2">
        <View className="bg-white rounded-lg p-4 shadow">
          <Image
            source={{ uri: image_urls[0] || defaultImage }}
            className="h-32 w-full"
            resizeMode="contain"
          />
          <Text className="text-sm font-medium mt-2">{title.slice(0, 21)}</Text>
          <Text className="text-sm text-red-500">$ {price}</Text>
          <View className="flex-row items-center">
            <Feather name="star" size={12} color="gold" />
            <Text className="text-xs">{rating}</Text>
            <Text className="text-xs text-gray-500 ml-1">
              ({reviews} Reviews)
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default ProductCard;
