const fs = require('fs');
const path = require('path');


function customRequireDirectory(dir)
{
    let mp = {};
    let fileNames = fs.readdirSync(dir);
    let indexFile = path.join(dir,'index.js');
    for(fileName of fileNames) {
        let file = path.join(dir,fileName);
        if(file !== indexFile) {
            mp[fileName] = require(file);
        }
    }
    return mp;
}