import { uploadFile } from "../services/imagekit.service.js";
import { AppError } from "./error.js";

export const getUploadURL = async (buffer, filename) => {
  if (!buffer || !filename) {
    throw new AppError(400, "File buffer and filename are required");
  }

  // Let service throw real errors
  const result = await uploadFile(buffer, filename);

  return result;
};
