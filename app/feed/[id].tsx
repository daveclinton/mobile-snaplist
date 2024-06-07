import { Link, Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";

import {
  ActivityIndicator,
  FocusAwareStatusBar,
  Text,
  View,
  Image,
  Pressable,
} from "@/ui";
import { useSingleProduct } from "@/api/market-places.tsx/use-inventory";
import { Notifications } from "@/ui/icons/notifications";

const EmptyState = require("../../assets/emptyState.svg");

export default function Post() {
  const local = useLocalSearchParams<{ id: string }>();

  console.log("ID is here", local?.id);
  const productId = local?.id;

  const { data, isLoading, isError } = useSingleProduct(productId as any);

  console.log("Data", data[0]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen
          options={{
            title: "Detail Product",
            headerBackTitleVisible: false,
            headerTintColor: "#2A2661",
            headerRight: () => <CreateNewPostLink />,
          }}
        />
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
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
              className=" h-full w-full overflow-hidden"
            />
          </View>
          <Text> Product Not Available </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-3 ">
      <Stack.Screen
        options={{
          title: "Detail Product",
          headerBackTitleVisible: false,
          headerTintColor: "#2A2661",
          headerRight: () => <CreateNewPostLink />,
        }}
      />
      <FocusAwareStatusBar />
      <Text className="text-xl">Here</Text>
      <Text>Here </Text>
    </View>
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
