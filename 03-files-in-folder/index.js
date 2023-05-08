const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.log("An error occurred while reading the directory", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log(
          `An error occurred while getting information about ${file}`,
          err
        );
        return;
      }

      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const extension = path.extname(file);
        const fileNameWithoutExtension = path.basename(file, extension);

        console.log(
          `${fileNameWithoutExtension} - ${extension.slice(
            1
          )} - ${fileSizeInKB.toFixed(3)}kb`
        );
      }
    });
  });
});
