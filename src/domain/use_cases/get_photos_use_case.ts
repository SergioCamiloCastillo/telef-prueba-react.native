import { PhotoEntity } from "../entities/photo_entity";
import { PhotoRepository } from "../repositories/photo_repository";


export class GetPhotosUseCase {
  constructor(private repository: PhotoRepository) {}

  async execute(page: number, limit: number): Promise<PhotoEntity[]> {
    return this.repository.getPhotos(page, limit);
  }
}