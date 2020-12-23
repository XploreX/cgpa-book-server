const path = require('path');
const fs = require('fs');

const express = require('express');

/**
 *
 * @param {String} dir
 * @param {Bool} pascalCase
 * @param {Router} router
 * @return {Object}
 */
function customRequireDirectoryRoutes(dir, pascalCase = false, router = null) {
  if (router === null) {
    // eslint-disable-next-line new-cap
    router = express.Router();
  }
  const fileNames = fs.readdirSync(dir);
  const indexFile = path.join(dir, 'index.js');

  for (fileName of fileNames) {
    const file = path.join(dir, fileName);
    const isDir = fs.lstatSync(file).isDirectory();
    if (isDir) {
      let tempName = '';
      for (let i = 0; i < fileName.length; i++) {
        if (fileName[i] === '-') {
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
      fileName = path.parse(fileName).name; // get fileName without extension
    }
    if (pascalCase) fileName = fileName[0] + fileName.slice(1);
    if (file !== indexFile) {
      router.use('/', require(file));
    }
  }
  return router;
}

module.exports = customRequireDirectoryRoutes;
