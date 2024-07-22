# image-collage-maker

image-collage-maker is a Node.js package that allows you to create customizable image collages from both local and online images. The package uses `sharp` for image processing and provides various customization options, such as specifying the shape of images, adding padding, and randomizing positions.

## Features

- Combine multiple images into a collage
- Support for local and online images
- Customizable image shapes (square, circle)
- Random shapes and positions
- Specify output format (JPEG, PNG, WEBP)
- Customizable collage size, image size, padding, and background color
- Optional output path for saving the collage

## Installation

You can install ImageCollageMaker via npm:

```sh
npm install image-collage-maker
```

## Usage

Here is an example of how to use ImageCollageMaker:

```typescript
import { createCollage, CollageOptions } from "image-collage-maker";
import fs from "fs";

async function main() {
  const folderPath = "./images"; // Specify your folder path here
  const imagePaths = await getImagesFromFolder(folderPath);
  imagePaths.push("https://example.com/image.jpg"); // Adding an online image example

  const options: CollageOptions = {
    collageSize: { width: 800, height: 800 },
    imageSize: { width: 100, height: 100 },
    imagesPerRow: 5,
    backgroundColor: { r: 255, g: 255, b: 255, alpha: 1 },
    padding: 10,
    outputFormat: "jpeg",
    outputQuality: 80,
    shape: "circle",
    randomShapeLevel: 5,
    randomPositionLevel: 5,
    outputPath: "output/collage.jpg", // Optional output path
  };

  try {
    const collageBuffer = await createCollage(imagePaths, options);
    const outputPath = options.outputPath || "collage.jpg";
    fs.writeFileSync(outputPath, collageBuffer);
    console.log(`Collage created and saved as ${outputPath}`);
  } catch (error) {
    console.error("Error creating collage:", error);
  }
}

main();
```

## API

### `createCollage(imagePaths: string[], options: CollageOptions): Promise<Buffer>`

Creates a collage from the provided images with the specified options.

#### Parameters

- `imagePaths`: An array of image paths (local paths or URLs).
- `options`: An object with the following properties:
  - `collageSize`: { width: number, height: number } - The dimensions of the final collage.
  - `imageSize`: { width: number, height: number } - The dimensions of each image in the collage.
  - `imagesPerRow`: number - The number of images per row in the collage.
  - `backgroundColor`: { r: number, g: number, b: number, alpha: number } - The background color of the collage, specified as RGBA.
  - `padding`: number - The padding between images in the collage.
  - `outputFormat`: 'jpeg' | 'png' | 'webp' - The format of the output file.
  - `outputQuality`: number - The quality of the output image (applicable for lossy formats like JPEG and WEBP).
  - `shape`: 'square' | 'circle' - The shape of the images.
  - `randomShapeLevel`: number (optional) - The level of randomness for shape (0-10).
  - `randomPositionLevel`: number (optional) - The level of randomness for position (0-10).
  - `outputPath`: string (optional) - The path to save the output collage.

#### Returns

- A `Promise` that resolves to a `Buffer` containing the image data of the collage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

````

### Publishing to npm

1. Ensure you have an npm account. If not, create one at [npmjs.com](https://www.npmjs.com/).
2. Log in to your npm account using the following command:
   ```sh
   npm login
````

3. Publish the package:
   ```sh
   npm publish
   ```

### Folder Structure

```

ImageCollageMaker/
│
├── src/
│   ├── index.ts
│   ├── utils.ts
│   ├── types.ts
│   └── collage.ts
├── dist/
│   └── index.js (generated after compilation)
├── images/ (example folder for local images)
├── .gitignore
├── LICENSE
├── README.md
├── package.json
└── tsconfig.json

```

### Additional Steps

1. **Create the `LICENSE` file** with the MIT License text.
2. **Compile the TypeScript** code before publishing:
   ```sh
   npx tsc
   ```
3. **Ensure all dependencies** are listed in `package.json`.

By following these steps, you'll have a complete and customizable image collage maker package, ready for open-source contribution and use.
