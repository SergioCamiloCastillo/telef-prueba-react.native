import { PhotoEntity } from "@/src/domain/entities/photo_entity";
import { PhotoRepository } from "@/src/domain/repositories/photo_repository";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPhotosDatasource } from "../datasources/api_datasource/photo_api_datasource";

const FAVORITES_KEY = "favorites";

export class PhotoRepositoryImpl implements PhotoRepository {
  async getPhotos(page: number, limit: number): Promise<PhotoEntity[]> {
    try {
      const photos = await getPhotosDatasource(page, limit);
      const favorites = await this.getFavorites();

      return photos.map((photo) => ({
        ...photo,
        isFavorite: favorites.some((fav) => fav.id === photo.id),
      }));
    } catch (error) {
      console.error("Error fetching photos:", error);
      throw new Error("Algo ha salido mal en el servidor al traer las imagenes.");
    }
  }

  async toggleFavorite(photo: PhotoEntity): Promise<void> {
    const favorites = await this.getFavorites();
    const index = favorites.findIndex((fav) => fav.id === photo.id);

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(photo);
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  async getFavorites(): Promise<PhotoEntity[]> {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }
}
