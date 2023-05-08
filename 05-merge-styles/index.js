const fs = require("fs");
const path = require("path");

const stylesDir = path.join(__dirname, "styles");
const outputFilePath = path.join(__dirname, "project-dist", "bundle.css");

async function mergeStyles() {
  try {
    const cssFiles = await fs.promises.readdir(stylesDir);
    const cssContents = await Promise.all(
      cssFiles
        .filter((file) => path.extname(file) === ".css")
        .map(async (file) => {
          const filePath = path.join(stylesDir, file);
          const contents = await fs.promises.readFile(filePath, "utf-8");
          return contents;
        })
    );
    await fs.promises.writeFile(
      outputFilePath,
      cssContents.join("\n"),
      "utf-8"
    );
    console.log("Bundle created successfully!");
  } catch (err) {
    console.error(`Error creating bundle: ${err.message}`);
  }
}

mergeStyles();
