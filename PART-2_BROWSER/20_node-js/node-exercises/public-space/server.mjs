import { createServer } from "node:http";
import { resolve, sep } from "node:path";
import { stat, readdir } from "node:fs/promises";
import {
  createReadStream,
  createWriteStream,
  unlink,
  rmdir,
  mkdir,
} from "node:fs";
import { lookup } from "mime-types";
import { join } from "node:path";

const methods = Object.create(null);

// Define the public directory
const publicDirectory = resolve(process.cwd(), "public");

// Define the server
createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch((error) => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      response.writeHead(status, { "Content-Type": type });
      if (body?.pipe)
        body.pipe(response); // If body is a stream, pipe it to response
      else response.end(body); // Otherwise, send body directly
    });
}).listen(8000, () => {
  console.log("Server is running at http://localhost:8000");
});

// Utility to resolve the path of URLs
const baseDirectory = process.cwd();

// Utility to resolve the path of URLs
function urlPath(url) {
  let { pathname } = new URL(url, "http://d");
  let path = resolve(decodeURIComponent(pathname).slice(1)); // Remove leading slash
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Forbidden" };
  }
  return path;
}

// Handling GET requests
methods.GET = async function (request) {
  let path;

  // If the request is for "/files", return the list of files in public/
  if (request.url === "/files") {
    try {
      const files = await readdir(publicDirectory);
      const filteredFiles = files.filter((file) => file !== "editor.html");
      return { body: JSON.stringify(filteredFiles), type: "application/json" };
    } catch (error) {
      return { status: 500, body: "Error reading directory" };
    }
  }

  // If the request is for "/", serve the editor.html file
  if (request.url === "/" || request.url === "") {
    path = join(publicDirectory, "editor.html");
  } else {
    // For other requests, use the requested URL and resolve it to the file path
    path = join(publicDirectory, decodeURIComponent(request.url));
  }

  let stats;
  try {
    stats = await stat(path); // Check if the file exists
  } catch (error) {
    if (error.code != "ENOENT") throw error; // Handle other errors
    else return { status: 404, body: "File not found" }; // File not found
  }

  if (stats.isDirectory()) {
    // If it's a directory, list the files in it
    const files = await readdir(path);
    return { body: JSON.stringify(files), type: "application/json" };
  } else {
    // If it's a file, serve it
    return { body: createReadStream(path), type: lookup(path) };
  }
};

// Handling DELETE requests
methods.DELETE = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return { status: 204 };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

// Handling PUT requests
function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};

// Handling MKCOL requests (create directory)
methods.MKCOL = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return { status: 204 };
  }
  if (stats.isDirectory()) return { status: 204 };
  else return { status: 400, body: "Not a directory" };
};

// Handle method not allowed
async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`,
  };
}
