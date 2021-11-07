const { readdir, mkdir, rmdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');
// const os = require('os');

const pathProjectFolder = path.join(__dirname, 'project-dist');
const pathComponentsFolder = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');
// const arrStyles = [];

const createDirectory = async () => {
  await mkdir(pathProjectFolder, { recursive: true });
}

const deleteDirectory = async () => {
  await rmdir(pathProjectFolder, { recursive: true });
}

const getComponentFiles = async () => {
  const componentsFolderFiles = await readdir(pathComponentsFolder, { withFileTypes: true });

  return componentsFolderFiles.filter(file => {
    const extName = path.extname(file.name).slice(1);
    
    if (file.isFile() && extName === 'html') {
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
  const components = await getComponentFiles();
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


const init = async () => {
  await createDirectory();
  let writeableStream = fs.createWriteStream(path.join(pathProjectFolder, 'index.html'))
  const htmlBundle = await createBundleHtml();
  writeableStream.write(htmlBundle);
}

init()