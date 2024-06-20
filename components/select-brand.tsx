import { baseUrl } from "@/api/common/client";
import { Text, View } from "@/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

interface DropdownItem {
  label: string;
  value: string;
}

interface SelectBrandProps {
  onBrandChange: (value: string | null) => void;
}

export default function SelectBrand({ onBrandChange }: SelectBrandProps) {
  const [brandData, setbrandData] = useState<DropdownItem[]>([]);
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategories();
        const data = await response.json();
        const formattedData = data.data.map((category: any) => ({
          label: category.label,
          value: category.label,
        }));
        setbrandData(formattedData);
        setIsError(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setIsError(true);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    if (brandData.length > 0) {
      setItems(brandData);
    }
  }, [brandData]);

  const handleValueChange = (newValue: string | null) => {
    setValue(newValue);
    onBrandChange(newValue);
  };

  return (
    <View className="z-50">
      <Text className="my-3">Brand</Text>
      {items.length > 0 && (
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={handleValueChange as any}
          setItems={setItems}
          listMode="MODAL"
          searchable={true}
        />
      )}
      {isError && (
        <Text className="my-3 text-red-500">Failed to load categories</Text>
      )}
    </View>
  );
}

async function getCategories() {
  const userData = await AsyncStorage.getItem("user-data");
  if (!userData) {
    throw new Error("User data not found");
  }
  const parsedUserData = JSON.parse(userData);
  const token = parsedUserData.access_token;
  const apiUrl = `${baseUrl}brands`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(apiUrl, options);
}
