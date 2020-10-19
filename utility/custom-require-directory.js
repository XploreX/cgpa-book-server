const fs = require('fs');
const path = require('path');


function customRequireDirectory(dir)
{
    let mp = {};
    let fileNames = fs.readdirSync(dir);
    let indexFile = path.join(dir,'index.js');
    for(fileName of fileNames) {
        let file = path.join(dir,fileName);
        let isDir = fs.lstatSync(file).isDirectory();
        if(!isDir)
            fileName = path.parse(fileName).name;   //get fileName without extension
        if(file !== indexFile) {
            mp[fileName] = require(file);
        }
    }
    return mp;
}

module.exports = customRequireDirectory;