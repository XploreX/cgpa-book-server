const sw = require('stopword');

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function getICRegexString(str) {
    return new RegExp(str,'i');
}

function getAbbreviation(str) {
    let line = str.split(' ');
    line = sw.removeStopwords(line);
    let s = "";
    ignore_reg = /[&()]+/;
    for(let word of line) {
        if(word.search(ignore_reg) != -1)
            continue;
        s += word[0].toUpperCase();
    }
    return s;
}

module.exports = {
    capitalizeFirstLetter  : capitalizeFirstLetter,
    getICRegexString : getICRegexString,
    getAbbreviation : getAbbreviation
}