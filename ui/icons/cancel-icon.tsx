import * as React from "react";
import { StyleSheet } from "react-native";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";

export const CancelIcon = ({ color = "#CCC", style, ...props }: SvgProps) => (
  <Svg viewBox="0 0 384 512" width={36} height={36} {...props}>
    <Path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
  </Svg>
);

export const SmallCancel = ({ color = "#CCC", style, ...props }: SvgProps) => (
  <Svg viewBox="0 0 384 512" width={24} height={24} {...props}>
    <Path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
  </Svg>
);
{
  /* {isPending ? (
        <Loader />
      ) : capturedImageUri && uploadResponseData === null ? (
        <View className="flex-1 justify-center p-6">
          <View className="flex justify-end items-end mb-2">
            <TouchableOpacity
              onPress={() => {
                setCapturedImageUri(null);
              }}
            >
              <SmallCancel />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: capturedImageUri }} style={{ flex: 1 }} />
          <Button onPress={handleImageUpload} label="Upload Image" />
        </View>
      ) : uploadResponseData !== null ? (
        <View className="flex-1 p-6">
          <View className="flex justify-end items-end mb-2">
            <TouchableOpacity
              onPress={() => {
                setUploadResponseData(null);
                setCapturedImageUri(null);
              }}
            >
              <SmallCancel />
            </TouchableOpacity>
          </View>
          {uploadResponseData && (
            <FlatList
              data={uploadResponseData.image_results}
              keyExtractor={(item, index) => item.position || index.toString()}
              renderItem={({ item }) => (
                <ProductItem key={item.position} {...item} />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      ) : null} */
}
