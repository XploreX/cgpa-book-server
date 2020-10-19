const path = require('path');
const fs = require('fs');

const mongoose = require('model');

const __ROOT = require(__dirname + '/../../config.js');
const utility = require(__ROOT + '/utility');

let fileNames = fs.readdirSync(__dirname);
let mp = {};

for(let fileName of fileNames) 
{
    let file = path.join(__dirname,fileName);
    isDir = fs.lstatSync(file).isDirectory();
    if(file !== __filename && !isDir)
    {
        fileName = path.parse(fileName).name;
        mp[fileName] = mongoose.model(utility.stringUtil.capitalizeFirstLetter(fileName),require(file));
    }
}

module.exports = mp;