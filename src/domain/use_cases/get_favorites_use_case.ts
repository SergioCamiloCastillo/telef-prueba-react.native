import { PhotoEntity } from "../entities/photo_entity";
import { PhotoRepository } from "../repositories/photo_repository";

export class GetFavoritesUseCase {
  constructor(private repository: PhotoRepository) {}

  async execute(): Promise<PhotoEntity[]> {
    return this.repository.getFavorites();
  }
}
