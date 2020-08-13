const {getICRegexString} = require('./string-helpers');

function updateValuesToIgnorecase(data) {
    for(key in data) {
        if(typeof data[key] == "string") {
            data[key] = getICRegexString(data[key],'i');
        }
    }
}

function updateValuesToRegExp(data) {
    for(key in data) {
        if(typeof data[key] == "string") {
            data[key] = new RegExp(data[key]);
        }
    }
}

module.exports = {
    updateValuesToIgnorecase : updateValuesToIgnorecase,
    updateValuesToRegExp : updateValuesToRegExp
}