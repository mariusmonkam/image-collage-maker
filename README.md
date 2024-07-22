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

feat: add optional image mask feature with customizable colors

```

#### Example Usage

Place the images to be resized in the `images` folder. Here is an example of how to use the `image-collage-maker` package to create a collage:

```javascript
const { createCollage, getImagesFromFolder } = require("image-collage-maker");

async function main() {
  const folderPath = "./images";
  const imagePaths = await getImagesFromFolder(folderPath);
  imagePaths.push(
    "https://images.unsplash.com/photo-1593642532973-d31b6557fa68"
  );

  const options = {
    collageSize: { width: 1000, height: 1000 },
    imagesPerRow: 4,
    padding: 20,
    margin: 20,
    outputFormat: "jpeg",
    outputQuality: 80,
    shape: "circle", // Default shape if shapesArray is not provided
    shapesArray: ["circle", "triangle", "hexagon", "rectangle"], // Optional array of shapes
    userDefinedImageSize: { width: 230, height: 230 },
    minImageSize: 100,
    maxImageSize: 300,
    outputPath: "output/collage.jpg",
    backgroundColor: "#f0f0f0", // Background color in HEX format
    imageMaskColors: ["#FF0000", "#00FF00"], // Example mask colors in HEX format
    useMasks: false, // Set to true to apply masks
  };

  try {
    await createCollage(imagePaths, options);
    console.log("Enhanced collage created and saved.");
  } catch (error) {
    console.error("Error creating collage:", error);
  }
}

main();
```

- **collageSize**: Size of the final collage (width and height).
- **imagesPerRow**: Number of images per row in the collage.
- **padding**: Padding between images.
- **margin**: Margin around the collage.
- **outputFormat**: Format of the output collage (`jpeg`, `png`, `webp`).
- **outputQuality**: Quality of the output collage (percentage from 0 to 100).
- **shape**: Shape of the images if `shapesArray` is not provided.
- **shapesArray**: Optional array of shapes for images.
- **userDefinedImageSize**: Size of the individual images.
- **minImageSize**: Minimum size for the images.
- **maxImageSize**: Maximum size for the images.
- **outputPath**: Path to save the output collage.
- **backgroundColor**: Background color of the collage.
- **imageMaskColors**: Array of colors for image masks.
- **useMasks**: Set to `true` to apply image masks.

```

## API

### `createCollage(imagePaths: string[], options: CollageOptions): Promise<Buffer>`

Creates a collage from the provided images with the specified options.

#### Returns

- A `Promise` that resolves to a `Buffer` containing the image data of the collage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

### Publishing to npm

1. Ensure you have an npm account. If not, create one at [npmjs.com](https://www.npmjs.com/).
2. Log in to your npm account using the following command:
   ```sh
   npm login
   ```

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
````
