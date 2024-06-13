import { Text, View, Image, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";

const ProductItem = ({
  title,
  snippet,
  source,
  favicon,
  link,
}: {
  [key: string]: any;
}) => {
  return (
    <Link href={link} asChild>
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
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default ProductItem;
