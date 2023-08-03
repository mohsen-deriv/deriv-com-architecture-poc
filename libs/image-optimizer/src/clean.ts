import { PROJECTS_EXPORT_FOLDERS, DEFAULT_EXPORT_FOLDER } from './constants';
import * as fs from 'fs';
import * as path from 'path';

// TODO: remove the json file as well
const foldersToBeRemoved = [...PROJECTS_EXPORT_FOLDERS, DEFAULT_EXPORT_FOLDER];
foldersToBeRemoved.forEach((folder) => {
  fs.rmSync(path.resolve(folder), { recursive: true, force: true });
});
