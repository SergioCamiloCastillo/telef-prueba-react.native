import axios from "axios";
import { PhotoEntity } from "@/src/domain/entities/photo_entity";

const API_URL = "https://picsum.photos/v2";

export const getPhotosDatasource = async (
  page: number,
  limit: number
): Promise<PhotoEntity[]> => {
  const response = await axios.get(
    `${API_URL}/list?page=${page}&limit=${limit}`
  );
  return response.data;
};
