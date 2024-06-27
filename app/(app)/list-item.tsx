/* eslint-disable max-lines-per-function */
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import {
  Button,
  ControlledNormalInput,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
  showErrorMessage,
  Image,
} from "@/ui";
import { useCreateInventory } from "@/api/market-places.tsx/use-create-inventory";
import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import SelectMarketPlace from "@/components/select-market";
import SelectCategory from "@/components/select-category";
import SelectBrand from "@/components/select-brand";

export default function ListItem() {
  const { handleSubmit, control, setValue } = useForm<any>({});
  const { mutate: createInventory, isPending } = useCreateInventory();
  const [sliderValue, setSliderValue] = useState(50);
  const router = useRouter();
  const handleSliderValueChange = (value: React.SetStateAction<number>) => {
    setSliderValue(value);
  };
  const [imageURI, setImageURI] = useState<any>(null);

  const [marketplace, setMarketplace] = useState<string | null>(null);
  const handleMarketplaceChange = (value: string | null) => {
    setMarketplace(value);
  };

  const [category, setCategory] = useState<string | null>(null);
  const handleCategoryChange = (value: string | null) => {
    setCategory(value);
  };

  const [brand, setBrand] = useState<string | null>(null);
  const handleBrandChange = (value: string | null) => {
    setBrand(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedImageURI = await AsyncStorage.getItem("capturedPhoto");
      const storedItemTitle = await AsyncStorage.getItem("productTitle");
      setImageURI(storedImageURI);
      if (storedItemTitle) {
        setValue("title", storedItemTitle);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (formData: any) => {
    const dummyData = {
      sku: "SNLE0098P",
      category: category,
      marketplace: marketplace,
      title: formData.title,
      subtitle: "We don't have one",
      description: formData.description,
      currency: "USD",
      price: parseFloat(sliderValue.toFixed(2)),
      isbn: "",
      brand: brand,
      quantity: 1,
      condition: "NEW",
      condition_description: formData.condition_description,
      locale: "en_US",
      images: [imageURI],
      weight_unit: "KILOGRAM",
      weight_value: 1,
      mpn: "MLVF3LL/A",
    };
    const data = {
      ...formData,
      ...dummyData,
    };

    createInventory(data, {
      onSuccess: async () => {
        router.push("/");
        await AsyncStorage.removeItem("capturedPhoto");
        await AsyncStorage.removeItem("productTitle");
        showMessage({
          message: "Product Created Successfully!",
          type: "success",
        });
      },
      onError: () => {
        showErrorMessage("Error Creating Product");
      },
    });
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FocusAwareStatusBar />
      {isPending && <Loader />}
      <View className="flex-1 px-6">
        <Button
          label="Take Picture"
          onPress={() => {
            router.push("/camera/camera-page");
          }}
          variant="outline"
        />
        {imageURI !== null && (
          <View className=" items-center justify-center">
            <Image
              source={{
                uri: imageURI,
              }}
              className="rounded-xl h-20 w-20 object-contain"
            />
          </View>
        )}
        <Text className="mt-1">Fill Item Details</Text>
        <ControlledNormalInput control={control} name="title" label="Title" />
        <ControlledNormalInput
          control={control}
          name="description"
          label="Description"
        />
        <SelectCategory onCategoryChange={handleCategoryChange} />
        <SelectBrand onBrandChange={handleBrandChange} />
        <ControlledNormalInput
          testID="email-input"
          control={control}
          name="condition_description"
          label="Condition"
        />
        <SelectMarketPlace onMarketplaceChange={handleMarketplaceChange} />
        <Text className="my-3">Set Price</Text>
        <View>
          <Slider
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: "100%", height: 40 }}
            minimumValue={50}
            maximumValue={10000}
            minimumTrackTintColor="#2A2661"
            maximumTrackTintColor="#2A2661"
            thumbTintColor="#2A2661"
            value={sliderValue}
            onValueChange={handleSliderValueChange}
          />
          <View className="flex flex-row justify-between px-2">
            <Text>$ 50.00</Text>
            <Text>$ {sliderValue.toFixed(2)}</Text>
          </View>
        </View>
        <Button label="List Now" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}
