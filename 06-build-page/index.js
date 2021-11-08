const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const os = require('os');

const pathProjectDirectory = path.join(__dirname, 'project-dist');
const pathComponentsDirectory = path.join(__dirname, 'components');
const pathAssetsDirectory = path.join(__dirname, 'assets');
const pathStylesDirectory = path.join(__dirname, 'styles');
const pathTemplate = path.join(__dirname, 'template.html');

const deleteDirectory = async (pathDirectory) => {
  await rm(pathDirectory, { recursive: true, force: true });
}

const createDirectory = async (pathDirectory) => {
  await mkdir(pathDirectory, { recursive: true });
}

const getDirectoryFiles = async (pathDirectory, extension) => {
  const directoryFiles = await readdir(pathDirectory, { withFileTypes: true });

  return directoryFiles.filter(file => {
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
  const components = await getDirectoryFiles(pathComponentsDirectory, 'html');
  let htmlBundle = await getHtmlTemplate();

  return Promise.all(components.map(component => 
    new Promise((res, rej) => {
      let htmlComponent = '';
      const pathComponent = path.join(pathComponentsDirectory, component.name);
      const nameComponent = path.basename(pathComponent, '.html');
      const componentReadStream = fs.createReadStream(pathComponent, 'utf-8');

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

const createBundleStyles = async () => {
  const styleFiles = await getDirectoryFiles(pathStylesDirectory, 'css');
  let styleBundle = '';

  return Promise.all(styleFiles.map(styleFile => 
    new Promise((res, rej) => {
      let styles = '';
      const pathStyleFile = path.join(pathStylesDirectory, styleFile.name);
      const styleFileReadStream = fs.createReadStream(pathStyleFile, 'utf-8');

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

const writeBundle = (outputFile, outputFileName) => {
  let writeableStream = fs.createWriteStream(path.join(pathProjectDirectory, outputFileName));
  writeableStream.write(outputFile);
}

const copyDirectory = async (pathDirectory, pathCopiedDirectory) => {
  await createDirectory(pathCopiedDirectory);

  const directoryContents = await readdir(pathDirectory, { withFileTypes: true });
  directoryContents.forEach(file => {
    if (file.isDirectory()) {
      const directoryName = file.name;
      const pathSubdirectory = path.join(pathDirectory, directoryName);
      const pathCopiedSubdirectory = path.join(pathCopiedDirectory, directoryName);
      copyDirectory(pathSubdirectory, pathCopiedSubdirectory);
    } else if (file.isFile()) {
      copyFileToDirectory(file.name, pathDirectory, pathCopiedDirectory);
    }
  })
}

const copyFileToDirectory = async (fileName, pathDirectory, pathCopiedDirectory) => {
  const pathFile = path.join(pathDirectory, fileName);
  const pathCopiedFile = path.join(pathCopiedDirectory, fileName);
  await copyFile(pathFile, pathCopiedFile);
}

const init = async () => {
  await deleteDirectory(pathProjectDirectory);
  await createDirectory(pathProjectDirectory);

  const htmlBundle = await createBundleHtml();
  writeBundle(htmlBundle, 'index.html');

  const stylesBundle = await createBundleStyles();
  writeBundle(stylesBundle, 'style.css');

  const pathCopiedDirectory = path.join(pathProjectDirectory, 'assets');
  await copyDirectory(pathAssetsDirectory, pathCopiedDirectory);
}

init()