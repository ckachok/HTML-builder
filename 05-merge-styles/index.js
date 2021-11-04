const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const os = require('os');

const pathStylesFolder = path.join(__dirname, 'styles');
const pathProjectFolder = path.join(__dirname, 'project-dist');
const arrStyles = [];
 
const writeableStream = fs.createWriteStream(path.join(pathProjectFolder, 'bundle.css'));

const writeStyles = () => {
  arrStyles.forEach(style => style.then((chunkStyle) => {
    writeableStream.write(`${chunkStyle}${os.EOL}`);
  }));
}

const readStyles = (styleFile) => {
  let styles = '';
  const filePath = path.join(pathStylesFolder, styleFile.name);

  return new Promise((res, rej) => {
    let readableStream = fs.createReadStream(filePath, 'utf-8');
    readableStream.on('data', (chunk) => { styles += chunk });
    readableStream.on('end', (err) => {
      res(styles);
    });
  });
}

const getStyleFiles = async () => {
  const folderContents = await readdir(pathStylesFolder, { withFileTypes: true });

  return folderContents.filter(file => {
    const extName = path.extname(file.name).slice(1);
    
    if (file.isFile() && extName === 'css') {
      return file;
    };
  });
}

const createBundleCSS = async () => {
  const styleFiles = await getStyleFiles();
  styleFiles.forEach(styleFile => {
    arrStyles.push(readStyles(styleFile))
  });
  writeStyles()
}

createBundleCSS();