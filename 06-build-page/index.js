const { readdir, mkdir, rmdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const os = require('os');

const pathProjectFolder = path.join(__dirname, 'project-dist');
const pathComponentsFolder = path.join(__dirname, 'components');
const pathStylesFolder = path.join(__dirname, 'styles');
const pathTemplate = path.join(__dirname, 'template.html');
// const arrStyles = [];

const createDirectory = async (pathFolder) => {
  await mkdir(pathFolder, { recursive: true });
}

const deleteDirectory = async (pathFolder) => {
  await rmdir(pathFolder, { recursive: true });
}

const getFiles = async (pathFolderFiles, extension) => {
  const folderFiles = await readdir(pathFolderFiles, { withFileTypes: true });

  return folderFiles.filter(file => {
    const extName = path.extname(file.name).slice(1);
    
    if (file.isFile() && extName === extension) {
      return file;
    };
  });
}

const getHtmlTemplate = async () => {
  let htmlTemplate = '';
  const templateReadStream = fs.createReadStream(pathTemplate, 'utf-8');

  return new Promise((res, rej) => {
    templateReadStream.on('data', data => {
      htmlTemplate += data;
    });
    templateReadStream.on('end', () => {
      res(htmlTemplate);
    });
  });
}

const createBundleHtml = async () => {
  const components = await getFiles(pathComponentsFolder, 'html');
  let htmlBundle = await getHtmlTemplate();

  return Promise.all(components.map(component => 
    new Promise((res, rej) => {
      let htmlComponent = '';
      const pathComponent = path.join(pathComponentsFolder, component.name);
      const nameComponent = path.basename(pathComponent, '.html');
      const componentReadStream = fs.createReadStream(pathComponent);

      componentReadStream.on('data', data => {
        htmlComponent += data;
      });
      componentReadStream.on('end', () => {
        htmlBundle = htmlBundle.replace(`{{${nameComponent}}}`, htmlComponent);
        res(htmlBundle);
      });
    })
  )).then(() => htmlBundle);
}

const writeBundleHtml = (html) => {
  let writeableStream = fs.createWriteStream(path.join(pathProjectFolder, 'index.html'));
  writeableStream.write(html);
}

const createBundleStyles = async () => {
  const styleFiles = await getFiles(pathStylesFolder, 'css');
  let styleBundle = '';

  return Promise.all(styleFiles.map(styleFile => 
    new Promise((res, rej) => {
      let styles = '';
      const pathStyleFile = path.join(pathStylesFolder, styleFile.name);
      const styleFileReadStream = fs.createReadStream(pathStyleFile);

      styleFileReadStream.on('data', data => {
        styles += data;
      });
      styleFileReadStream.on('end', () => {
        styleBundle = styleBundle + styles + os.EOL;
        res(styleBundle);
      });
    })
  )).then(() => styleBundle);
}

const writeBundleStyles = (style) => {
  const writeableStream = fs.createWriteStream(path.join(pathProjectFolder, 'style.css'));
  writeableStream.write(style);
}

const init = async () => {
  await deleteDirectory(pathProjectFolder);
  await createDirectory(pathProjectFolder);

  const htmlBundle = await createBundleHtml();
  writeBundleHtml(htmlBundle);

  const stylesBundle = await createBundleStyles();
  writeBundleStyles(stylesBundle);
}

init()