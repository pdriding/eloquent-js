import { readFileSync } from "node:fs";
import { statSync } from "fs";

// Get the regular expression string from the command line arguments
const regexString = process.argv[2];

// Convert the string into a RegExp object
const regex = new RegExp(regexString, "g");

// Get the file paths from the subsequent arguments
const filePaths = process.argv.slice(3);

// Function to search files
function searchFiles(filePaths, regex) {
  filePaths.forEach((filePath) => {
    try {
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        console.log(`${filePath} is a directory!`);

        // Recursively search the files in the directory
        const filesInDirectory = readdirSync(filePath);
        const fullPaths = filesInDirectory.map((file) => join(filePath, file));
        searchFiles(fullPaths, regex); // Call searchFiles recursively on directory contents
      } else {
        const content = readFileSync(filePath, "utf8"); // Read the file content
        if (regex.test(content)) {
          console.log(`Pattern found in ${filePath}`);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });
}

searchFiles(filePaths, regex);
