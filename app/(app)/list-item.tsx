/* eslint-disable max-lines-per-function */
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
} from "@/ui";
import { useCreateInventory } from "@/api/market-places.tsx/use-create-inventory";
import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListItem() {
  const { handleSubmit, control } = useForm<any>({});
  const { mutate: createInventory, isPending } = useCreateInventory();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Ebay", value: "Ebay" },
    { label: "Facebook", value: "Facebook" },
  ]);
  const [sliderValue, setSliderValue] = useState(50);
  const router = useRouter();
  const handleSliderValueChange = (value: React.SetStateAction<number>) => {
    setSliderValue(value);
  };

  const onSubmit = async (formData: any) => {
    const imageURI = await AsyncStorage.getItem("capturedPhoto");
    const dummyData = {
      sku: "ABC123",
      category: "Electronics",
      ebay_offer_id: "12345678",
      marketplace: value,
      title: formData.title,
      subtitle: formData.subTitle,
      description: formData.description,
      currency: "USD",
      price: parseFloat(sliderValue.toFixed(2)),
      isbn: "",
      brand: "Apple",
      quantity: 1,
      condition: "NEW",
      condition_description: formData.condition_description,
      locale: "en_US",
      images: imageURI ? [imageURI] : [],
      weight_unit: "POUND",
      weight_value: 0,
      mpn: "MLVF3LL/A",
    };
    const data = {
      ...formData,
      ...dummyData,
    };
    console.log(data, "data");
    createInventory(data, {
      onSuccess: () => {
        router.push("/");
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
      <SafeAreaView>
        <View className="flex-1 px-6">
          <Button
            label="Take Picture"
            onPress={() => {
              router.push("/camera/camera-page");
            }}
            variant="outline"
          />
          <Text>Fill Item Details</Text>
          <ControlledNormalInput control={control} name="title" label="Title" />
          <ControlledNormalInput
            control={control}
            name="description"
            label="Description"
          />
          <ControlledNormalInput
            control={control}
            name="subTitle"
            label="Category"
          />
          <ControlledNormalInput
            testID="email-input"
            control={control}
            name="condition_description"
            label="Condition"
          />
          <Text className="my-3">MarketPlace</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode="SCROLLVIEW"
          />
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
      </SafeAreaView>
    </ScrollView>
  );
}
