import { PhotoEntity } from "../entities/photo_entity";

export interface PhotoRepository {
  getPhotos(page: number, limit: number): Promise<PhotoEntity[]>;
  toggleFavorite(photo: PhotoEntity): Promise<void>;
  getFavorites(): Promise<PhotoEntity[]>;
}