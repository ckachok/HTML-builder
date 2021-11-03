// const { readdir, stat } = require('fs/promises');
// const { resolve: resolvePath, parse: parsePath } = require('path');

// (async () => {
//   const foldername = 'secret-folder';
//   const entries = await readdir(resolvePath(__dirname, foldername), {
//     withFileTypes: true,
//   });
//   const files = entries.filter((entry) => entry.isFile());
//   const statPromises = files.map(({ name }) =>
//     stat(resolvePath(__dirname, foldername, name))
//   );
//   const stats = await Promise.all(statPromises);
//   stats.forEach(({ size }, index) => {
//     const { name, ext } = parsePath(files[index].name);
//     console.log(`${name} - ${ext.substring(1)} - ${size}`);
//   });
// })();


// const fs = require('fs');
// const path = require('path');
// let f;
// //let stats;

// const folderPath = path.join(__dirname, 'secret-folder');
// const files = fs.readdir(folderPath, { withFileTypes: true },
//   (err, files) => {
//   console.log("\ninformation about files in secret-folder:\n");
//   if (err)
//     console.log(err);
//   else {
//     files.forEach(file => {
//       if (file.isFile()) {
//         const pathToFile = path.join(__dirname, `secret-folder/${file.name}`)
//         fileInf = path.parse(file.name);
//         let fileName = fileInf.name;
//         let fileExt = fileInf.ext.slice(1);
//         fs.stat(pathToFile, (err, stats) => {
//           console.log(`${fileName} - ${fileExt} - ${Math.ceil(stats.size / 1024)}kb `)
//         });
//       }
//     })
//   }
// })


// const { readdir, stat } = require('fs/promises');
// const path = require('path');

// const printFilesInfo = async (dirPath, fileFullName) => {
//     const BYTES_IN_KB = 1024;
//     const extName = path.extname(fileFullName);
//     const fileName = path.basename(fileFullName, extName);
//     const fileWeight = (await stat(path.resolve(dirPath, fileFullName))).size;
//     console.log(`${fileName} - ${extName.slice(1)} - ${fileWeight / BYTES_IN_KB}kb`);
// }

// const getFilesInDir = async (dir) => {
//     const dirPath = path.resolve(__dirname, dir);
//     const dirEntts = await readdir(dirPath, { withFileTypes: true, });
//     const dirFiles = dirEntts.filter(entity => entity.isFile());
//     dirFiles.forEach(file => { printFilesInfo(dirPath, file.name); });
// }

// getFilesInDir('secret-folder');


const { readdir } = require('fs/promises');
const path = require('path');


const displayFileInfo = (fileFullName) => {
  const extName = path.extname(file).slice(1);
  console.log(extName);
  const fileName = path.basename(fileFullName, extName);
  console.log(fileName);
  
}

const getFiles = async () => {
  const folderPath = path.join(__dirname, 'secret-folder');
  const folderContents = await readdir(folderPath, { withFileTypes: true });
  folderContents.forEach(file => {
    if (file.isFile()) {
      displayFileInfo(file.name);
    }
  })
}



getFiles();

// try {
//   const files = await readdir(path);
//   for (const file of files)
//     console.log(file);
// } catch (err) {
//   console.error(err);
// }