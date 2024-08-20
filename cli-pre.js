const fs = require("fs/promises");
const sharp = require("sharp");

async function main() {
  const inFolder = "/infiles";
  const outFolder = "/outfiles";

  const files = await fs.readdir(inFolder);

  for (const file of files) {
    console.log(`processing file ${file}`);
    await sharp(`${inFolder}/${file}`)
      .resize(200, 200)
      .toFormat("jpeg")
      .toFile(`${outFolder}/${file}.jpeg`);
  }
}
main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
