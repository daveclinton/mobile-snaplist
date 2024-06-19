import { Link, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  useMarketPlaces,
  useProfileData,
} from "@/api/market-places.tsx/use-marketplaces";
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
  const { data: profileData } = useProfileData();
  const connectedMarketplaces = profileData?.connected_marketplaces || [];
  const connectedMarketplacesStatus = connectedMarketplaces.map(
    (marketplace: any) => {
      return {
        marketplace_id: marketplace.marketplace_id,
        connected: true,
      };
    }
  );
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
        {data?.data?.map((item: any) => {
          const connectedMarketplace = connectedMarketplacesStatus.find(
            (marketplace: any) =>
              marketplace.marketplace_id === item.id && marketplace.connected
          );
          return (
            <Link
              disabled={connectedMarketplace}
              key={item?.name}
              href={item?.consent_url || ""}
              asChild
            >
              <Pressable
                className={`my-4 p-4 bg-white rounded-md shadow-md ${
                  connectedMarketplace ? "border-2 border-[#2A2661]" : ""
                }`}
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
                      <Text className="text-[#2A2661] text-lg">
                        {item?.name}
                      </Text>
                      <Text className="text-[#2A2661] text-lg">
                        {connectedMarketplace ? "Connected" : "Not Connected"}
                      </Text>
                    </View>
                  </View>
                  <FontAwesome
                    name={
                      connectedMarketplace ? "check-circle-o" : "arrow-right"
                    }
                    size={24}
                    color="#2A2661"
                  />
                </View>
              </Pressable>
            </Link>
          );
        })}
        {profileData?.connected_marketplaces.length > 0 && (
          <Button
            label="Close Page"
            onPress={() => router.push("/")}
            className="mt-[10%]"
          />
        )}
      </View>
    </>
  );
}
