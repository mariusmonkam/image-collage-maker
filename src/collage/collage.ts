import sharp from "sharp";
import fs from "fs";
import path from "path";
import { CollageOptions } from "../types/types";
import { fetchImage } from "../utils/utils";

// Helper function for shape masks
function createMask(
  shape: string,
  width: number,
  height: number,
  color: string // Direct color string
): Buffer {
  switch (shape) {
    case "circle":
      const radius = Math.min(width, height) / 2;
      return Buffer.from(
        `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" fill="${color}" /></svg>`
      );
    case "triangle":
      return Buffer.from(
        `<svg><polygon points="0,${height} ${
          width / 2
        },0 ${width},${height}" fill="${color}" /></svg>`
      );
    case "hexagon":
      const side = width / 2;
      const hexHeight = height / 2;
      return Buffer.from(
        `<svg><polygon points="${side},0 ${width},${hexHeight} ${side},${height} 0,${hexHeight}" fill="${color}" /></svg>`
      );
    case "rectangle":
      return Buffer.from(
        `<svg><rect width="${width}" height="${height}" fill="${color}" /></svg>`
      );
    case "square":
    default:
      return Buffer.from(
        `<svg><rect width="${width}" height="${height}" fill="${color}" /></svg>`
      );
  }
}

export async function createCollage(
  imagePaths: string[],
  options: CollageOptions
): Promise<Buffer> {
  const {
    collageSize,
    imagesPerRow,
    padding,
    margin = 20,
    outputFormat,
    outputQuality,
    shape,
    shapesArray,
    outputPath,
    userDefinedImageSize,
    minImageSize = 100,
    maxImageSize = 300,
    backgroundColor = "#FFFFFF", // Default to white
    imageMaskColors = [], // Custom mask colors for images
    useMasks = true, // Default to true
  } = options;

  const collageWidth = collageSize.width;
  const collageHeight = collageSize.height;

  // Calculate number of images per row and column
  const numCols = imagesPerRow;
  const numRows = Math.ceil(imagePaths.length / numCols);

  // Calculate the size of each image
  const effectiveWidth = collageWidth - 2 * margin;
  const effectiveHeight = collageHeight - 2 * margin;

  const imageWidth = (effectiveWidth - (numCols - 1) * padding) / numCols;
  const imageHeight = (effectiveHeight - (numRows - 1) * padding) / numRows;

  // Clamp image size to within min and max limits
  const clampedWidth = Math.max(
    minImageSize,
    Math.min(maxImageSize, imageWidth)
  );
  const clampedHeight = Math.max(
    minImageSize,
    Math.min(maxImageSize, imageHeight)
  );

  // Create a blank collage buffer with the specified background color
  let collage = sharp({
    create: {
      width: collageWidth,
      height: collageHeight,
      channels: 4, // RGBA
      background: backgroundColor,
    },
  });

  console.log(`Collage dimensions: ${collageWidth}x${collageHeight}`);
  console.log(
    `Calculated image size: ${Math.round(clampedWidth)}x${Math.round(
      clampedHeight
    )}`
  );

  // Prepare the images
  const images = [];
  for (const path of imagePaths) {
    try {
      const imgBuffer = path.startsWith("http")
        ? await fetchImage(path)
        : fs.readFileSync(path);

      let img = sharp(imgBuffer).resize(
        Math.round(clampedWidth),
        Math.round(clampedHeight),
        {
          fit: "cover",
          position: "center",
        }
      );

      if (useMasks) {
        const currentShape =
          Array.isArray(shapesArray) && shapesArray.length > 0
            ? shapesArray[images.length % shapesArray.length]
            : shape;

        const maskColor =
          imageMaskColors.length > 0
            ? imageMaskColors[images.length % imageMaskColors.length]
            : backgroundColor;

        if (currentShape) {
          const mask = createMask(
            currentShape,
            clampedWidth,
            clampedHeight,
            maskColor
          );
          img = img.composite([{ input: mask, blend: "dest-in" }]);
        }
      }

      images.push(await img.toBuffer());
    } catch (error) {
      console.error(`Error processing image at path: ${path}`, error);
    }
  }

  // Fill empty slots by repeating images
  const totalSlots = numRows * numCols;
  while (images.length < totalSlots) {
    images.push(images[images.length % imagePaths.length]);
  }

  // Create the composite operations
  const compositeOperations = [];
  for (let i = 0; i < totalSlots; i++) {
    const row = Math.floor(i / numCols);
    const col = i % numCols;
    const x = margin + col * (clampedWidth + padding);
    const y = margin + row * (clampedHeight + padding);

    compositeOperations.push({
      input: images[i],
      left: Math.round(x),
      top: Math.round(y),
    });
  }

  collage = collage.composite(compositeOperations);

  // Output the collage in the specified format
  let collageBuffer: Buffer;
  try {
    switch (outputFormat) {
      case "jpeg":
        collageBuffer = await collage
          .jpeg({ quality: outputQuality })
          .toBuffer();
        break;
      case "png":
        collageBuffer = await collage
          .png({ quality: outputQuality })
          .toBuffer();
        break;
      case "webp":
        collageBuffer = await collage
          .webp({ quality: outputQuality })
          .toBuffer();
        break;
      default:
        throw new Error("Unsupported output format");
    }

    if (outputPath) {
      fs.writeFileSync(outputPath, collageBuffer);
    }

    return collageBuffer;
  } catch (error) {
    console.error("Error generating collage:", error);
    throw error;
  }
}
