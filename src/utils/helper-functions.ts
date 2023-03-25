/**
 * A quick and easy way to create a new file relative to the project root.
 * Will create directories if they don't exist.
 */
export const createFile = async (
  pathRelativeToProjectRoot: string,
  fileContents: string
) => {
  const fs = await import("fs");
  const path = await import("path");

  const { fileURLToPath } = await import("url");
  const absolutePathToThisDir = path.dirname(fileURLToPath(import.meta.url));
  const absoluteProjectRoot = path.resolve(absolutePathToThisDir, "../..");

  const filePath = `${absoluteProjectRoot}/${pathRelativeToProjectRoot}`;

  if (!fs.existsSync(path.dirname(filePath))) {
    console.log("Creating directory", path.dirname(filePath));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFile(filePath, fileContents, (err) => {
    if (err) {
      console.error("Error while writing to file", { filePath, err });
      throw err;
    }
    console.log("File written successfully", filePath);
  });
};

