const path = require("path");
const fs = require("fs");

const express = require("express");

function customRequireDirectoryRoutes(dir, pascalCase = false, router = null) {
  if (router === null) {
    router = express.Router();
  }
  let fileNames = fs.readdirSync(dir);
  let indexFile = path.join(dir, "index.js");

  for (fileName of fileNames) {
    let file = path.join(dir, fileName);
    let isDir = fs.lstatSync(file).isDirectory();
    if (isDir) {
      let tempName = "";
      for (let i = 0; i < fileName.length; i++) {
        if (fileName[i] === "-") {
          if (i !== fileName.length - 1) {
            ++i;
            tempName += fileName[i].toUpperCase();
          }
        } else {
          tempName += fileName[i];
        }
      }
      fileName = tempName;
    } else {
      fileName = path.parse(fileName).name; //get fileName without extension
    }
    if (pascalCase) fileName = fileName[0] + fileName.slice(1);
    if (file !== indexFile) {
      router.use("/", require(file));
    }
  }
  return router;
}

module.exports = customRequireDirectoryRoutes;
