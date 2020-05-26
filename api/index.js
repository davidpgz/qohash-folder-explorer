const express = require("express");
const { resolve, dirname, join, normalize } = require('path');
const { readdir, lstat } = require('fs').promises;

const app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

app.get("/", async (request, response) => {
    console.log(request.query);

    let entryCount = 0;
    const requestPath = request.query.path;
    const requestComputeDepth = request.query.depth || 0;
    try {
        const entryDtos = await getDirectoryEntries(requestPath, requestComputeDepth);
        entryDtos.sort((a,b) => b.size - a.size || a.name.localeCompare(b.name));

        entryCount = entryDtos.length;
        response.json({ 
            totalSize: entryDtos.reduce((accumulator, entry) => accumulator + entry.size, 0),
            hasPartialSize: entryDtos.some(entry => entry.hasPartialSize),
            entries: entryDtos
        });
    } catch(error) {
        response.status(400).json(`Unable to scan directory: ${error}`);
    }
    });

app.get("/search", async (request, response) => {
    console.log(request.query);

    const requestSearchPath = request.query.path;
    // When the search path is /something/deep/, dirname returns /something.
    // To prevent that from happening when the path ends with / or \ (on Windows) dirname is not used.
    const directory = requestSearchPath.endsWith("/") || requestSearchPath.endsWith("\\") 
        ? requestSearchPath 
        : dirname(requestSearchPath);

    try {
        const entries = await readdir(directory, { withFileTypes: true });
        const directoryEntries = entries.filter((entry) => entry.isDirectory());
        response.json({ directories: directoryEntries.map(entry => join(directory, entry.name))})
    } catch (error) {
        response.status(400).json(`Unable to search directory: ${error}`);
    }
});

async function getDirectoryEntries(requestPath, maxComputeDepth) {
    const entries = await readdir(requestPath, { withFileTypes: true });
    const entryDtos = await Promise.all(entries.map(async (entry) => {
        const entryPath = resolve(requestPath, entry.name);

        let size = null;
        let lastModifiedDate = null;
        try {
            const stat = await lstat(entryPath);
            size = stat.size;
            lastModifiedDate = stat.mtime;
        }
        catch (lstatError) {
            // It may happens when the process doesn't have the right to access the file or the folder.
            console.log(lstatError);
        }
        const isDirectory = entry.isDirectory();
        return {
            name: entry.name,
            isDirectory: isDirectory,
            isSymbolicLink: entry.isSymbolicLink(),
            size: size != null ? size : null,
            hasPartialSize: isDirectory || size == null,
            lastModifiedDate
        };
    }));
    return entryDtos;
}
