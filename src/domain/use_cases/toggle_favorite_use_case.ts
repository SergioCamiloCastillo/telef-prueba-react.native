import { PhotoEntity } from "../entities/photo_entity";
import { PhotoRepository } from "../repositories/photo_repository";


export class ToggleFavoriteUseCase {
  constructor(private repository: PhotoRepository) {}

  async execute(photo: PhotoEntity): Promise<void> {
    return this.repository.toggleFavorite(photo);
  }
}