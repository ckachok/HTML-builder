const fs = require('fs');
const os = require('os');
const readline = require('readline');
const path = require('path');
const process = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

console.log('Welcome! The session has started. Enter text:');
rl.prompt();

const endSession = (event) => {
  if (event === 0) {
    console.log(`${os.EOL}The session has ended. Goodbye!`);
  } else {
    console.log('The session has ended. Goodbye!');
  }  
}

process.on('beforeExit', (event) => endSession(event));

rl.on('line', (text) => {
  if (text === 'exit') {
    endSession();
    process.exit();
  }

  writeableStream.write(`${text}${os.EOL}`);
  rl.prompt();
});


/*
Если в ходе проверки вы столкнулись с какой-либо проблемой напишите либо мне в дискорд либо
спросите совета в чате задания.

Самопроверка задания 02-write-file:

  [✓] - синхронные методы отсутствуют;
  [✓] - при выполнении команды node 02-write-file в консоли появляется приглашение на ввод текста,
        а в каталоге 02-write-file был создан текстовый файл;
  [✓] - после ввода текста, ввод корректно записывается в созданный текстовый файл;
  [✓] - при использовании сочетание клавиш ctrl + c в консоль выводится прощальная фраза с последующим завершением процесса;
  [✓] - при вводе exit в консоль выводится прощальная фраза с последующим завершением процесса.

Итого за задание: 20 баллов
*/