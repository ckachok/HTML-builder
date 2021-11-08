const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const path = require('path');

const pathCurrentFolder = path.join(__dirname, 'files');
const pathCopiedFolder = path.join(__dirname, 'files-copy');

const createDirectory = async () => {
  await mkdir(pathCopiedFolder, { recursive: true });
}

const deleteDirectory = async () => {
  await rm(pathCopiedFolder, { recursive: true, force: true });
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


/*
Если в ходе проверки вы столкнулись с какой-либо проблемой напишите либо мне в дискорд либо
спросите совета в чате задания.

Самопроверка задания 04-copy-directory:

  [✓] - синхронные методы отсутствуют;
  [✓] - экспериментальная функция fsPromises.cp() не используется;
  [✓] - при выполнении команды node 04-copy-directory в папке 04-copy-directory создается
        папка files-copy с точной копией содержимого исходной папки files;
  [✓] - после добавления/удаления одного или нескольких файлов в папку files и повторного запуска команды node 04-copy-directory
        создается папка files-copy со всеми внесенными изменениями в папку files.

Итого за задание: 20 баллов
*/