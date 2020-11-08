const sw = require('stopword');

function getAbbreviation(str) {
    let line = str.split(' ');
    line = sw.removeStopwords(line);
    // console.log(line);
    let s = "";
    ignore_reg = /[&()]+/;
    for(let word of line) {
        word = word.trim();
        if(word.search(ignore_reg) != -1 || word.length  === 0)
            continue;
        s += word[0].toUpperCase();
    }
    return s;
}

module.exports = getAbbreviation;