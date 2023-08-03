import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import type { ImageObject } from '../types';

export const ensureDirectoryExists = (filePath: string) => {
  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, {
      recursive: true,
    });
  }
};

export const getAllFilesAsObject = (
  basePath: string,
  dirPath: string,
  exportFolderName: string,
  arrayOfFiles: ImageObject[] = []
) => {
  // check if the path is existing
  if (fs.existsSync(basePath)) {
    const files = fs.readdirSync(path.resolve(basePath, dirPath));

    files.forEach(function (file: string) {
      if (
        fs
          .statSync(path.resolve(basePath, dirPath) + '/' + file)
          .isDirectory() &&
        file !== exportFolderName &&
        file !== 'nextImageExportOptimizer' // default export folder name
      ) {
        arrayOfFiles = getAllFilesAsObject(
          basePath,
          dirPath + '/' + file,
          exportFolderName,
          arrayOfFiles
        );
      } else {
        const dirPathWithoutBasePath = dirPath
          .replace(basePath, '') // remove the basePath for later path composition
          .replace(/^(\/)/, ''); // remove the first trailing slash if there is one at the first position
        arrayOfFiles.push({ basePath, dirPathWithoutBasePath, file });
      }
    });
  } else {
    console.log('dir does not exists');
  }

  return arrayOfFiles;
};

export const getImageHash = (items: any[]) => {
  const hash = createHash('sha256');
  for (const item of items) {
    if (typeof item === 'number') hash.update(String(item));
    else {
      hash.update(item);
    }
  }
  // See https://en.wikipedia.org/wiki/Base64#Filenames
  return hash.digest('base64').replace(/\//g, '-');
};

export const copyFolderSync = (from: string, to: string) => {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach((element) => {
      if (fs.lstatSync(path.join(from, element)).isFile()) {
        fs.copyFileSync(path.join(from, element), path.join(to, element));
      } else {
        copyFolderSync(path.join(from, element), path.join(to, element));
      }
    });
  }
};
