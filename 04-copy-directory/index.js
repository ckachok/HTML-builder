const { mkdir, rmdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

const pathCurrentFolder = path.join(__dirname, 'files');
const pathCopiedFolder = path.join(__dirname, 'files-copy');

const createDirectory = async () => {
  await mkdir(pathCopiedFolder, { recursive: true });
}

const deleteDirectory = async () => {
  await rmdir(pathCopiedFolder, { recursive: true });
}

const getFiles = async () => {
  const folderContents = await readdir(pathCurrentFolder, { withFileTypes: true });
  folderContents.forEach(file => {
    if (file.isFile()) {
      copyFileToDirectory(file.name);
    }
  })
}

const copyFileToDirectory = async (fileName) => {
  const pathCurrentFile = path.join(pathCurrentFolder, fileName);
  const pathCopiedFile = path.join(pathCopiedFolder, fileName);
  await copyFile(pathCurrentFile, pathCopiedFile);
}

const init = async () => {
  await deleteDirectory();
  await createDirectory()
  await getFiles();
}

init();