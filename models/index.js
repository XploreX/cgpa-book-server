const path = require('path');
const fs = require('fs');

const __ROOT = require('/../config.js');
const utility = require(_ROOT + '/utility');

const fileNames = fs.readdirSync(__dirname);

for(let fileName in fileNames)
{
    let file = path.join(__dirname,fileName);
    isDir = fs.lstat(file).isDirectory();
    if(isDir)
    {
        module.exports[fileName] = require(file);
    }
}