import { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";

export default function CameraRoll() {
  const [albums, setAlbums] = useState<MediaLibrary.Album[] | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    async function getAlbums() {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      setAlbums(fetchedAlbums);
    }
    getAlbums();
  }, [permissionResponse, requestPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {albums &&
          albums.map((album) => <AlbumEntry key={album.id} album={album} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
function AlbumEntry({ album }: { album: MediaLibrary.Album }) {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  if (album.assetCount === 0) return null;
  return (
    <View key={album.id} style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? "no"} assets
      </Text>
      <View style={styles.albumAssetsContainer}>
        {assets &&
          assets.map((asset) => {
            return (
              <View key={asset.id}>
                <Image
                  style={styles.image}
                  source={{ uri: asset.uri }}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  image: {
    width: 70,
    height: 130,
    borderRadius: 10,
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
});
