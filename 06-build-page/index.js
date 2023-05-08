const fs = require("fs");
const path = require("path");
const COMPONETS_PATH = path.join(__dirname, "components");
const OUTPUT_PATH = path.join(__dirname, "project-dist");
const OUTPUT_HTML = path.join(OUTPUT_PATH, "index.html");
const STYLE_PATH = path.join(__dirname, "styles");
const TEMPLATE_PATH = path.join(__dirname, "template.html");
const STYLE_OUTPUT = path.join(OUTPUT_PATH, "style.css");
const ASSETS_PATH = path.join(__dirname, "assets");
const ASSETS_OUTPUT = path.join(OUTPUT_PATH, "assets");

function wrapToPromise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

async function recursiveCopyFiles(source, output) {
  await wrapToPromise(fs.mkdir, output, { recursive: true });
  const files = await wrapToPromise(fs.readdir, source);

  for (const file of files) {
    const filePath = path.join(source, file);
    const fileCopyPath = path.join(output, file);
    const stat = await wrapToPromise(fs.stat, filePath);
    if (stat.isFile()) {
      await wrapToPromise(fs.copyFile, filePath, fileCopyPath);
    } else if (stat.isDirectory()) {
      recursiveCopyFiles(filePath, fileCopyPath);
    }
  }
}

async function build() {
  // создать папку
  await wrapToPromise(fs.mkdir, OUTPUT_PATH, { recursive: true });

  // заменить теплейт на компоненты
  const template = await wrapToPromise(fs.readFile, TEMPLATE_PATH, {
    encoding: "utf-8",
  });
  const components_list = await wrapToPromise(fs.readdir, COMPONETS_PATH);
  const components = await Promise.all(
    components_list.map(async (file) => {
      const content = await wrapToPromise(
        fs.readFile,
        path.join(COMPONETS_PATH, file)
      );
      return {
        name: file.replace(".html", ""),
        content: content.toString(),
      };
    })
  );

  const output_html = template.replace(/\{\{(\w+)\}\}/g, (s, name) => {
    const content = components.find((i) => i.name === name)?.content;
    return content;
  });

  await wrapToPromise(fs.writeFile, OUTPUT_HTML, output_html);

  // собрать стили в файл

  const cssFiles = await fs.promises.readdir(STYLE_PATH);
  const cssContents = await Promise.all(
    cssFiles
      .filter((file) => path.extname(file) === ".css")
      .map(async (file) => {
        const filePath = path.join(STYLE_PATH, file);
        const contents = await fs.promises.readFile(filePath, "utf-8");
        return contents;
      })
  );

  await fs.promises.writeFile(STYLE_OUTPUT, cssContents.join("\n"), "utf-8");

  // копировать ассеты
  await wrapToPromise(fs.mkdir, ASSETS_OUTPUT, { recursive: true });

  await recursiveCopyFiles(ASSETS_PATH, ASSETS_OUTPUT);
}

build().then(() => {
  console.log("done");
});
