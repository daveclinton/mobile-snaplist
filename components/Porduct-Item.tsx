import { Text, View, Image, Pressable } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductItem = ({
  title,
  snippet,
  source,
  favicon,
  link,
}: {
  [key: string]: any;
}) => {
  const router = useRouter();
  const handlePress = async () => {
    try {
      await AsyncStorage.setItem("productTitle", title);
      router.push("/list-item");
    } catch (error) {
      console.error("Failed to save the title to storage", error);
    }
  };
  return (
    <Pressable>
      <View className="bg-white p-2 justify-center items-center rounded-lg w-full mb-4 border border-slate-200">
        <View className="flex-row justify-center items-center">
          <View className=" items-center justify-center">
            <Image
              source={{
                uri: favicon,
              }}
              className="rounded-xl h-20 w-20 object-contain"
            />
          </View>
          <View className="flex-1 w-[100%] p-2">
            <View>
              <Text className="font-bold">{title}</Text>
              <Text className="text-xs">{snippet}</Text>
            </View>
            <View className="mt-2">
              <Text className="text-xs">Source: {source}</Text>
            </View>
            <Link href={link}>
              <Text>Link: </Text>
              <Text className="text-xs underline text-blue-400">
                {link?.slice(0, 21)}
              </Text>
            </Link>
            <TouchableOpacity onPress={handlePress}>
              <View className="bg-[#2A2661] mt-2 w-1/4 flex justify-end rounded-md items-center h-4 px-2">
                <Text className="text-xs text-white">LIST ITEM</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductItem;
