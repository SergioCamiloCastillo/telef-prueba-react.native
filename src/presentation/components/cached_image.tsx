import React, { useState, useEffect } from "react";
import { Image, ActivityIndicator, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";

const CACHE_DIR = FileSystem.cacheDirectory + "image-cache/";

async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

async function getCachedImage(uri: string): Promise<string> {
  await ensureDirExists();

  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const localUri = CACHE_DIR + filename;
  const fileInfo = await FileSystem.getInfoAsync(localUri);

  if (fileInfo.exists) {
    return localUri;
  }

  await FileSystem.downloadAsync(uri, localUri);
  return localUri;
}

interface CachedImageProps {
  source: { uri: string };
  style?: object;
  [key: string]: any;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  source,
  style,
  ...props
}) => {
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const uri = await getCachedImage(source.uri);
        if (isMounted) {
          setImgUri(uri);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error caching image:", error);
        if (isMounted) {
          setImgUri(source.uri); // Fallback to network image
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [source.uri]);

  if (loading) {
    return <ActivityIndicator style={[style, styles.loading]} />;
  }

  return <Image
  source={{ uri: imgUri || "" }}
  style={[style]} 
  {...props}
/>;
};

const styles = StyleSheet.create({
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
});
