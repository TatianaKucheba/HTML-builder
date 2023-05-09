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

  const filesCopy = await fs.readdir(path.join(workDir, "files-copy"));

  for (const file of filesCopy) {
    const filePath = path.join(workDir, "files", file);
    const fileCopyPath = path.join(workDir, "files-copy", file);
    try {
      await fs.stat(filePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.unlink(fileCopyPath);
      } else {
        throw err;
      }
    }
  }
}

copyDir()
  .then(() => console.log("Done!"))
  .catch(console.error);
