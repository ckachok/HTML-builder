const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');

readableStream.on('data', (chunk) => console.log(chunk));


/*
Если в ходе проверки вы столкнулись с какой-либо проблемой напишите либо мне в дискорд либо
спросите совета в чате задания.

Самопроверка задания 01-read-file:

  [✓] - синхронные методы отсутствуют;
  [✓] - для чтения файла используется ReadStream;
  [✓] - при выполнении команды node 01-read-file в консоль выводится содержимое файла text.txt;
  [✓] - после изменения содержимого файла text.txt и повторного запуска команды node 01-read-file, результат
        соответствует текущему состоянию файла text.txt.

Итого за задание: 20 баллов
*/