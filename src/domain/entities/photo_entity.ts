export interface PhotoEntity {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  isFavorite?: boolean;
}
