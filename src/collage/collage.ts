import sharp from "sharp";
import fs from "fs";
import path from "path";
import { CollageOptions } from "../types/types";
import { fetchImage } from "../utils/utils";

export async function createCollage(
  imagePaths: string[],
  options: CollageOptions
): Promise<Buffer> {
  const {
    collageSize,
    imageSize,
    imagesPerRow,
    backgroundColor,
    padding,
    outputFormat,
    outputQuality,
    shape,
    randomShapeLevel = 0,
    randomPositionLevel = 0,
    outputPath,
  } = options;

  const collageWidth = collageSize.width;
  const collageHeight = collageSize.height;
  const imageWidth = imageSize.width;
  const imageHeight = imageSize.height;

  // Create a blank collage buffer with the specified background color
  let collage = sharp({
    create: {
      width: collageWidth,
      height: collageHeight,
      channels: 4,
      background: backgroundColor,
    },
  });

  console.log(`Collage dimensions: ${collageWidth}x${collageHeight}`);

  // Create an array to store all composite operations
  const compositeOperations = [];

  // Iterate over each image path and prepare composite operations
  for (let i = 0; i < imagePaths.length; i++) {
    let imgBuffer: Buffer;
    try {
      if (imagePaths[i].startsWith("http")) {
        console.log(`Fetching online image: ${imagePaths[i]}`);
        imgBuffer = await fetchImage(imagePaths[i]);
      } else {
        console.log(`Reading local image: ${imagePaths[i]}`);
        imgBuffer = fs.readFileSync(imagePaths[i]);
      }
      console.log(`Image Buffer: ${imgBuffer.toString("hex", 0, 20)}...`); // Log the start of the buffer

      let img = sharp(imgBuffer).resize(imageWidth, imageHeight);

      // Apply shape if specified
      if (shape === "circle" || randomShapeLevel > 0) {
        const radius = Math.min(imageWidth, imageHeight) / 2;
        const mask = Buffer.from(
          `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`
        );
        img = img.composite([{ input: mask, blend: "dest-in" }]);
      }

      // Calculate grid position
      const row = Math.floor(i / imagesPerRow);
      const col = i % imagesPerRow;

      // Apply padding
      const x = col * (imageWidth + padding);
      const y = row * (imageHeight + padding);

      // Ensure x and y are within collage bounds
      const finalX = Math.min(x, collageWidth - imageWidth);
      const finalY = Math.min(y, collageHeight - imageHeight);

      console.log(`Compositing image at position (${finalX}, ${finalY})`);

      // Add to composite operations instead of immediately compositing
      compositeOperations.push({
        input: await img.toBuffer(),
        left: finalX,
        top: finalY,
      });
    } catch (error) {
      console.error(`Error processing image at path: ${imagePaths[i]}`, error);
    }
  }

  // Apply all composite operations at once
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
        collageBuffer = await collage.png().toBuffer();
        break;
      case "webp":
        collageBuffer = await collage
          .webp({ quality: outputQuality })
          .toBuffer();
        break;
      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }
  } catch (error) {
    console.error("Error generating collage buffer:", error);
    throw error;
  }

  // Save to file if outputPath is specified
  if (outputPath) {
    try {
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, collageBuffer);
      console.log(`Collage created and saved as ${outputPath}`);
    } catch (error) {
      console.error("Error saving collage to file:", error);
      throw error;
    }
  }

  return collageBuffer;
}
