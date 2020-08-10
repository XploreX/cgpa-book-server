const fs = require('fs');
const path = require('path');
const glob = require('glob');
const {model} = require('mongoose');
const {basicErrorHandler} = require('../utility/error-handlers.js');
const {capitalizeFirstLetter} = require('../utility/string-helpers');

let jsFilePattern = /\.js$/; //Not getting used at the moment , can be useful later on

function addModelsToExports(dir) {
    try {
        files = glob.sync('*.js',{cwd : dir,matchBase : true});
    }
    catch(err) {
        basicErrorHandler(err);
    }
    for(const file of files) {
        if(file != path.relative(dir,__filename))
        {
            let modelName = capitalizeFirstLetter(file.split('.')[0].split('/').slice(-1)[0]);  //basically getting file base name with first letter capitalized
            // let schemaName = file.split('.')[0] + 'Schema';
            let schemaFile = './'+file;
            // console.log(modelName,schemaFile);
            // console.log(file);
            module.exports[modelName] = model(modelName,require(schemaFile));
        }
    }
}
addModelsToExports(__dirname);