import { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { usePhotoStore } from "@/src/store/usePhotoStore";
import { CachedImage } from "@/src/presentation/components/cached_image";
import { PhotoEntity } from "@/src/domain/entities/photo_entity";
import { useNavigation } from "expo-router";

export default function FavoritesScreen() {
  const navigation = useNavigation();

  const { favorites, loading, error, loadFavorites, toggleFavorite } =
    usePhotoStore();

  useEffect(() => {
    loadFavorites();
    navigation.setOptions({ title: 'Mis Favoritas' });
  }, []);

  const renderItem = ({ item }: { item: PhotoEntity }) => (
    <View style={styles.item}>
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
          >
            <MaterialIcons name="favorite" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (loading && favorites.length === 0) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.withoutFavorites}>
          No tienes imágenes favoritas aún
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  item: {
    flex: 1 / 2,
    margin: 4,
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 8,
    zIndex: 10,
  },
  favoriteButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  withoutFavorites: {
    fontSize: 16,
  },
});
