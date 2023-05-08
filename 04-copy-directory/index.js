const fs = require("fs").promises;
const path = require("path");
const workDir = path.resolve("./04-copy-directory");

async function copyDir() {
  await fs.mkdir("./04-copy-directory/files-copy", { recursive: true });

  const files = await fs.readdir(path.join(workDir, "files"));

  for (const file of files) {
    const filePath = path.join(workDir, "files", file);
    const fileCopyPath = path.join(workDir, "files-copy", file);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      await fs.copyFile(filePath, fileCopyPath);
    }
  }
}

copyDir()
  .then(() => console.log("Done!"))
  .catch(console.error);
