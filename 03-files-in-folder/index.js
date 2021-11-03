const { readdir, stat } = require('fs/promises');
const path = require('path');
const BYTE_TO_KILOBYTE = 1024;

const displayFileInfo = async (fileFullName, folderPath) => {
  const extName = path.extname(fileFullName).slice(1);
  const fileName = path.basename(fileFullName, extName).slice(0, -1);
  const fileToPath = path.join(folderPath, fileFullName);
  const sizeFile = (await stat(fileToPath)).size / BYTE_TO_KILOBYTE + 'kb';
  console.log(`${fileName} - ${extName} - ${sizeFile}`);
}

const getFiles = async () => {
  const folderPath = path.join(__dirname, 'secret-folder');
  const folderContents = await readdir(folderPath, { withFileTypes: true });
  folderContents.forEach(file => {
    if (file.isFile()) {
      displayFileInfo(file.name, folderPath);
    }
  })
}

getFiles();