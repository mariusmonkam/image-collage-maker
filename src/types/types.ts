export interface CollageOptions {
  collageSize: { width: number; height: number };
  imageSize: { width: number; height: number };
  imagesPerRow: number;
  backgroundColor: { r: number; g: number; b: number; alpha: number };
  padding: number;
  outputFormat: "jpeg" | "png" | "webp";
  outputQuality: number; // Used for lossy formats like JPEG
  shape: "square" | "circle";
  randomShapeLevel?: number; // Level of randomness for shape (0-10)
  randomPositionLevel?: number; // Level of randomness for position (0-10)
  outputPath?: string; // Optional output path
}
