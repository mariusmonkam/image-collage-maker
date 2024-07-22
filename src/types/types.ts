// types/types.ts

export interface CollageOptions {
  collageSize: {
    width: number;
    height: number;
  };
  imagesPerRow: number;
  padding: number;
  margin?: number; // Optional, defaults to 20
  outputFormat: "jpeg" | "png" | "webp";
  outputQuality: number; // Quality percentage (0-100)
  shape: "circle" | "triangle" | "hexagon" | "rectangle" | "square";
  shapesArray?: string[]; // Optional array of shapes for images
  outputPath?: string; // Optional path to save the collage
  userDefinedImageSize?: {
    width: number;
    height: number;
  };
  minImageSize?: number; // Optional, minimum size for images
  maxImageSize?: number; // Optional, maximum size for images
  backgroundColor?: string; // Background color in HEX, RGB, or RGBA format
  imageMaskColors?: string[]; // Optional array of colors for image masks in HEX, RGB, or RGBA format
  useMasks?: boolean; // Optional flag to enable or disable image masks
}
