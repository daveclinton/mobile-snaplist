import { Text } from "@/ui";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

interface DropdownItem {
  label: string;
  value: string;
}

interface SelectMarketPlaceProps {
  onMarketplaceChange: (value: string | null) => void;
}

export default function SelectMarketPlace({
  onMarketplaceChange,
}: SelectMarketPlaceProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([
    { label: "Ebay", value: "Ebay" },
    { label: "Facebook", value: "Facebook" },
  ]);

  const handleValueChange = (newValue: string | null) => {
    setValue(newValue);
    onMarketplaceChange(newValue);
  };

  return (
    <>
      <Text className="my-3">MarketPlace</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={handleValueChange as any}
        setItems={setItems}
        listMode="SCROLLVIEW"
      />
    </>
  );
}
