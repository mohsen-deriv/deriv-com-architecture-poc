import * as fs from 'fs';
// import sharp from 'sharp';
const sharp = require('sharp');
import * as path from 'path';
import type { ImageObject } from './types';
import {
  copyFolderSync,
  ensureDirectoryExists,
  getAllFilesAsObject,
  getImageHash,
} from './utils';

import {
  DEFAULT_EXPORT_FOLDER,
  DEFAULT_RAW_IMAGES_FOLDER,
  PROJECTS_EXPORT_FOLDERS,
} from './constants';
import defineProgressBar from './progress-bar';

const optimizeImages = async () => {
  console.log('---- Deriv Image Optimizer: Begin with optimization... ---- ');

  const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const quality = 75;
  const storePicturesInWEBP = true;
  const blurSize: number[] = [];

  let imageHashes: {
    [key: string]: string;
  } = {};
  const hashFilePath = `${DEFAULT_RAW_IMAGES_FOLDER}/next-image-export-optimizer-hashes.json`;
  try {
    const rawData = fs.readFileSync(hashFilePath);
    imageHashes = JSON.parse(rawData.toString());
  } catch (e) {
    // No image hashes yet
  }

  const allFiles = getAllFilesAsObject(
    'libs/images',
    'assets',
    DEFAULT_EXPORT_FOLDER
  );

  const allImagesInImageFolder = allFiles.filter((fileObject: ImageObject) => {
    if (fileObject === undefined) return false;
    if (fileObject.file === undefined) return false;
    // check if the file has a supported extension
    const filenameSplit = fileObject.file.split('.');
    if (filenameSplit.length === 1) return false;
    const extension = filenameSplit.pop()!.toUpperCase();
    // Only include file with image extensions
    return ['JPG', 'JPEG', 'WEBP', 'PNG', 'AVIF', 'GIF'].includes(extension);
  });

  console.log(
    `Found ${allImagesInImageFolder.length} supported images in ${DEFAULT_RAW_IMAGES_FOLDER}, static folder and subdirectories `
  );

  const widths = [...blurSize, ...deviceSizes];
  const progressBar = defineProgressBar();
  if (allImagesInImageFolder.length > 0) {
    console.log(`Using sizes: ${widths.toString()}`);
    console.log(
      `Start optimization of ${allImagesInImageFolder.length} images with ${
        widths.length
      } sizes resulting in ${
        allImagesInImageFolder.length * widths.length
      } optimized images...`
    );
    progressBar.start(allImagesInImageFolder.length * widths.length, 0, {
      sizeOfGeneratedImages: 0,
    });
  }

  let sizeOfGeneratedImages = 0;
  const allGeneratedImages: string[] = [];

  const updatedImageHashes: {
    [key: string]: string;
  } = {};

  let hasImagesChanges = false;

  // Loop through all images
  for (let index = 0; index < allImagesInImageFolder.length; index++) {
    // try catch to catch errors in the loop and let the user know which image caused the error
    try {
      const file = allImagesInImageFolder[index].file;
      const fileDirectory =
        allImagesInImageFolder[index].dirPathWithoutBasePath;
      const basePath = allImagesInImageFolder[index].basePath;

      let extension = file.split('.').pop()!.toUpperCase();
      const imageBuffer = fs.readFileSync(
        path.join(basePath, fileDirectory, file)
      );
      const imageHash = getImageHash([
        imageBuffer.toString(),
        ...widths,
        quality,
        fileDirectory,
        file,
      ]);
      const keyForImageHashes = `${fileDirectory}/${file}`;

      let hashContentChanged = false;
      if (imageHashes[keyForImageHashes] !== imageHash) {
        hashContentChanged = true;
      }
      // Store image hash in temporary object
      updatedImageHashes[keyForImageHashes] = imageHash;

      let optimizedOriginalWidthImagePath;
      let optimizedOriginalWidthImageSizeInMegabytes;

      // Loop through all widths
      for (let indexWidth = 0; indexWidth < widths.length; indexWidth++) {
        const width = widths[indexWidth];

        const filename = path.parse(file).name;
        if (storePicturesInWEBP) {
          extension = 'avif';
        }

        const basePathToStoreOptimizedImages = path.resolve(
          DEFAULT_EXPORT_FOLDER
        );

        const optimizedFileNameAndPath = path.join(
          basePathToStoreOptimizedImages,
          fileDirectory,
          `${filename}-opt-${width}.${extension.toUpperCase()}`
        );

        // Check if file is already in hash and specific size and quality is present in the
        // opt file directory
        if (
          !hashContentChanged &&
          keyForImageHashes in imageHashes &&
          fs.existsSync(optimizedFileNameAndPath)
        ) {
          const stats = fs.statSync(optimizedFileNameAndPath);
          const fileSizeInBytes = stats.size;
          const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
          sizeOfGeneratedImages += fileSizeInMegabytes;
          progressBar.increment({
            sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
          });
          allGeneratedImages.push(optimizedFileNameAndPath);

          continue;
        }

        hasImagesChanges = true;

        const transformer = sharp(imageBuffer, {
          animated: true,
          limitInputPixels: false, // disable pixel limit
        });

        transformer.rotate();

        const { width: metaWidth = 0 } = await transformer.metadata();

        // For a static image, we can skip the image optimization and the copying
        // of the image for images with a width greater than the original image width
        // we will stop the loop at the first image with a width greater than the original image width
        let nextLargestSize = -1;
        for (let i = 0; i < widths.length; i++) {
          if (
            Number(widths[i]) >= metaWidth &&
            (nextLargestSize === -1 || Number(widths[i]) < nextLargestSize)
          ) {
            nextLargestSize = Number(widths[i]);
          }
        }
        if (nextLargestSize !== -1 && width > nextLargestSize) {
          progressBar.increment({
            sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
          });
          continue;
        }

        // If the original image's width is X, the optimized images are
        // identical for all widths >= X. Once we have generated the first of
        // these identical images, we can simply copy that file instead of redoing
        // the optimization.
        if (
          optimizedOriginalWidthImagePath &&
          optimizedOriginalWidthImageSizeInMegabytes
        ) {
          fs.copyFileSync(
            optimizedOriginalWidthImagePath,
            optimizedFileNameAndPath
          );

          sizeOfGeneratedImages += optimizedOriginalWidthImageSizeInMegabytes;
          progressBar.increment({
            sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
          });
          allGeneratedImages.push(optimizedFileNameAndPath);

          continue;
        }

        const resize = metaWidth && metaWidth > width;
        if (resize) {
          transformer.resize(width);
        }

        const avifQuality = quality - 15;
        transformer.avif({
          quality: Math.max(avifQuality, 0),
          chromaSubsampling: '4:2:0', // same as webp
        });

        ensureDirectoryExists(optimizedFileNameAndPath);
        const info = await transformer.toFile(optimizedFileNameAndPath);
        const fileSizeInBytes = info.size;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        sizeOfGeneratedImages += fileSizeInMegabytes;
        progressBar.increment({
          sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
        });
        allGeneratedImages.push(optimizedFileNameAndPath);

        if (!resize) {
          optimizedOriginalWidthImagePath = optimizedFileNameAndPath;
          optimizedOriginalWidthImageSizeInMegabytes = fileSizeInMegabytes;
        }
      }
    } catch (error) {
      console.log(
        `
      Error while optimizing image ${allImagesInImageFolder[index].file}
      ${error}
      `
      );
      // throw the error so that the process stops
      throw error;
    }
  }
  const data = JSON.stringify(updatedImageHashes, null, 4);
  ensureDirectoryExists(hashFilePath);
  fs.writeFileSync(hashFilePath, data);
  PROJECTS_EXPORT_FOLDERS.forEach((project) => {
    const resolvedProjectPath = path.resolve(project);
    if (hasImagesChanges) {
      if (fs.existsSync(resolvedProjectPath)) {
        fs.rmSync(resolvedProjectPath, {
          recursive: true,
          force: true,
        });
      }
      ensureDirectoryExists(resolvedProjectPath);
      copyFolderSync(
        path.resolve(DEFAULT_EXPORT_FOLDER, 'assets'),
        path.resolve(resolvedProjectPath)
      );
    } else {
      if (!fs.existsSync(resolvedProjectPath)) {
        ensureDirectoryExists(resolvedProjectPath);
        copyFolderSync(
          path.resolve(DEFAULT_EXPORT_FOLDER, 'assets'),
          path.resolve(resolvedProjectPath)
        );
      }
    }
  });
};

optimizeImages();
