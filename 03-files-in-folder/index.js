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


/*
Если в ходе проверки вы столкнулись с какой-либо проблемой напишите либо мне в дискорд либо
спросите совета в чате задания.

Самопроверка задания 03-files-in-folder:

  [✓] - синхронные методы отсутствуют;
  [✓] - при выполнении команды node 03-files-in-folder в консоль выводится информация о файлах,
        содержащихся внутри secret-folder (информация о файлах находящихся в подпапках выводиться не должна);
  [✓] - после добавлении в папку secret-folder одного или нескольких файлов разного размера и двух папок,
        одна из которых имеет фальшивое расширение, и повторного запуска скрипта корректность выводимых данных сохраняется.

Итого за задание: 20 баллов
*/