import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const userObject = JSON.parse(storage.getString("userData") as string);
