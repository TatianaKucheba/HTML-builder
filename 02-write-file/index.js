const fs = require("fs");
const readline = require("readline");

const filePath = "./02-write-file/output.txt";

const writeStream = fs.createWriteStream(filePath, { flags: "a" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Введите текст или "exit" для выхода:');

rl.on("line", (input) => {
  if (input === "exit") {
    console.log("До свидания!");
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on("SIGINT", () => {
  console.log("До свидания!");
  rl.close();
});

rl.on("close", () => {
  writeStream.end();
});
process.on("SIGINT", () => {
  console.log("Goodbye!");
  stream.end();
  process.exit();
});
