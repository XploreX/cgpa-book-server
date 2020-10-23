const sw = require('stopword');

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

module.exports = getAbbreviation;