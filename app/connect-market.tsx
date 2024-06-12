import { Stack, useRouter } from "expo-router";
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
const Ebay = require("../assets/ebay.svg");
const Facebook = require("../assets/facebook.svg");

export default function ConnectMarket() {
  const router = useRouter();
  const { data, isLoading } = useMarketPlaces();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  console.log(isDataLoaded);

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
        <View className="mt-2 flex flex-row flex-wrap gap-5">
          {data?.data?.map(
            (
              { consent_url, name }: { consent_url: any; name: string },
              index: any
            ) => (
              <Pressable
                key={index}
                onPress={() => {
                  router.push(consent_url);
                }}
                className="h-20 w-20 rounded-full bg-white shadow-lg"
              >
                <Image
                  source={name === "Ebay" ? Ebay : Facebook}
                  className="h-full w-full overflow-hidden"
                />
              </Pressable>
            )
          )}
        </View>
        <Text className="text-center text-xl">OR</Text>
        <Button
          label="Skip"
          onPress={() => router.push("/")}
          className="mt-[10%]"
        />
      </View>
    </>
  );
}
