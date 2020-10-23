const fs = require("fs");
const path = require("path");

const mongoose = require('mongoose');

function customRequireDirectoryModels(dir, pascalCase = false) {
  let mp = {};
  let fileNames = fs.readdirSync(dir);
  let indexFile = path.join(dir, "index.js");
  for (fileName of fileNames) {
    let file = path.join(dir, fileName);
    let isDir = fs.lstatSync(file).isDirectory();
    if (isDir) {
      throw new Error(
        "subdirectories should not be present when using customRequireDirectoryModels"
      );
    } else {
      fileName = path.parse(fileName).name; //get fileName without extension
    }
    if (pascalCase) {
      fileName = fileName[0].toUpperCase() + fileName.slice(1);
    }
    if (file !== indexFile) {
      mp[fileName] = mongoose.model(fileName,require(file));
    }
  }
  return mp;
}

module.exports = customRequireDirectoryModels;
