import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";
import { AppError } from "../lib/error.js";

dotenv.config();

const imagekit = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
});

export const uploadFile = async (buffer, filename) => {
  try {
    if (!buffer || !filename) {
      throw new AppError(400, "No file uploaded");
    }

    const result = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: filename,
    });

    return result;
  } catch (error) {
    throw new AppError(500, error.message);
  }
};
