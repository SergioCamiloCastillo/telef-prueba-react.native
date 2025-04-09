import { create } from "zustand";
import { PhotoEntity } from "../domain/entities/photo_entity";
import { PhotoRepositoryImpl } from "../infrastructure/repositories/photo_repository_impl";
import { GetPhotosUseCase } from "../domain/use_cases/get_photos_use_case";
import { ToggleFavoriteUseCase } from "../domain/use_cases/toggle_favorite_use_case";
import { GetFavoritesUseCase } from "../domain/use_cases/get_favorites_use_case";

interface PhotoState {
  photos: PhotoEntity[];
  favorites: PhotoEntity[];
  loading: boolean;
  error: string | null;
  page: number;
  fetchPhotos: (loadMore?: boolean) => Promise<void>;
  toggleFavorite: (photo: PhotoEntity) => Promise<void>;
  loadFavorites: () => Promise<void>;
}
//Esto funciona para modularizar el codigo cuando quiero cambiar de datasource o fuente de datos sin que se rompa la app por el cambio
const repository = new PhotoRepositoryImpl();
const getPhotosUseCase = new GetPhotosUseCase(repository);
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(repository);
const getFavoritesUseCase = new GetFavoritesUseCase(repository);

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  favorites: [],
  loading: false,
  error: null,
  page: 1,

  fetchPhotos: async (loadMore = false) => {
    try {
      set({ loading: true, error: null });
      const currentPage = loadMore ? get().page + 1 : 3;
      const photos = await getPhotosUseCase.execute(currentPage, 10);

      set((state) => ({
        photos: loadMore ? [...state.photos, ...photos] : photos,
        page: currentPage,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Algo ha salido mal en el servidor al traer las imagenes.", loading: false });
    }
  },

  toggleFavorite: async (photo: PhotoEntity) => {
    await toggleFavoriteUseCase.execute(photo);
    const favorites = await getFavoritesUseCase.execute();

    set((state) => ({
      photos: state.photos.map((p) =>
        p.id === photo.id ? { ...p, isFavorite: !p.isFavorite } : p
      ),
      favorites,
    }));
  },

  loadFavorites: async () => {
    try {
      const favorites = await getFavoritesUseCase.execute();
      set({ favorites });
    } catch (error) {
      console.error("Error loading favorites:", error);
      set({ error: "Failed to load favorites" });
    }
  },
}));
