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