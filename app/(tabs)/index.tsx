import { useCallback, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { usePhotoStore } from "@/src/store/usePhotoStore";
import { CachedImage } from "@/src/presentation/components/cached_image";
import { PhotoEntity } from "@/src/domain/entities/photo_entity";

export default function GalleryScreen() {
  const { photos, loading, error, fetchPhotos, toggleFavorite } =
    usePhotoStore();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loading && !error) {
      fetchPhotos(true);
    }
  }, [loading, error]);

  // Animación para el spinner
  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderItem = ({
    item,
    index,
  }: {
    item: PhotoEntity;
    index: number;
  }) => (
    <View style={styles.item} key={`photos-${item.id}-${index}`}>
      <View style={styles.imageContainer}>
        <CachedImage
          source={{ uri: item.download_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item)}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={item.isFavorite ? "favorite" : "favorite-border"}
              size={20}
              color={item.isFavorite ? "red" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonImage} />
    </View>
  );

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            photos.length > 0 ? (
              <View style={styles.footer}>
                <View style={styles.spinnerContainer}>
                  <Animated.View
                    style={[styles.spinner, { transform: [{ rotate: spin }] }]}
                  >
                    <MaterialIcons name="autorenew" size={32} color="#18AAFF" />
                  </Animated.View>
                  <Text style={styles.loadingText}>Cargando más fotos...</Text>
                </View>
              </View>
            ) : (
              <FlatList
                data={[...Array(20).keys()]}
                renderItem={renderSkeletonItem}
                numColumns={3}
                keyExtractor={(item) => item.toString()}
              />
            )
          ) : null
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5FF",
    padding: 8
  },
  listContainer: {
    padding: 8,
  },
  item: {
    flex: 1,
    margin: 4,
    aspectRatio: 0.75,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 2,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  footer: {
    paddingVertical: 20,
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  spinner: {
    marginBottom: 12,
  },
  loadingText: {
    color: "#18AAFF",
    fontSize: 14,
  },
  skeletonItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
  },
  skeletonImage: {
    flex: 1,
    backgroundColor: "#e1e1e1",
    borderRadius: 12,
  },
});
