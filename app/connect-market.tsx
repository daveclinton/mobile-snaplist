import { Link, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { useMarketPlaces } from "@/api/market-places.tsx/use-marketplaces";
import {
  Button,
  FocusAwareStatusBar,
  Image,
  Pressable,
  Text,
  View,
} from "@/ui";
import Loader from "@/components/Loader";
import { FontAwesome } from "@expo/vector-icons";
const Ebay = require("../assets/ebay.svg");
const Facebook = require("../assets/facebook.svg");

export default function ConnectMarket() {
  const router = useRouter();
  const { data, isLoading } = useMarketPlaces();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    if (!isLoading && data) {
      setIsDataLoaded(true);
    }
  }, [isLoading, data]);

  if (!isDataLoaded) {
    return <Loader />;
  }

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 px-6 py-20">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-center text-xl font-bold">
          Choose Marketplace to Connect
        </Text>
        {data?.data?.map((item: any) => (
          <Link key={item?.name} href={item?.consent_url || ""} asChild>
            <Pressable
              onPress={() => {
                setTimeout(() => {
                  setIsFirstTime(false);
                }, 200);
              }}
              className="my-4  p-4 bg-white rounded-md shadow-md"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Pressable className="h-20 w-20 rounded-full bg-white">
                    <Image
                      source={item?.name === "Ebay" ? Ebay : Facebook}
                      className="h-full w-full overflow-hidden"
                    />
                  </Pressable>
                  <View>
                    <Text className="text-[#2A2661] text-lg">{item?.name}</Text>
                    <Text className="text-[#2A2661] text-sm">
                      Press Card to Connect
                    </Text>
                  </View>
                </View>
                <FontAwesome name="arrow-right" size={24} color="#2A2661" />
              </View>
            </Pressable>
          </Link>
        ))}
        {!isFirstTime && (
          <Button
            label="Next"
            onPress={() => router.push("/")}
            className="mt-[10%]"
          />
        )}
      </View>
    </>
  );
}
