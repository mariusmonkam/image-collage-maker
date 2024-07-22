import axios from "axios";
import fs from "fs";
import path from "path";

export async function fetchImage(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

export async function getImagesFromFolder(
  folderPath: string
): Promise<string[]> {
  const files = fs.readdirSync(folderPath);
  return files
    .filter((file) => /\.(jpg|jpeg|png)$/i.test(file))
    .map((file) => path.join(folderPath, file));
}
