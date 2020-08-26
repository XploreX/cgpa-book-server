const sw = require('stopword');

stopwordsTemp = sw.en;
stopwords = new Set();

for(word of stopwordsTemp) {
    stopwords.add(word);
}

stopwords.delete('i');

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

function getTitleForm(str) {   //First letter capitalize of all words which are not stopwords
    let title = [];
    let line = str.split(' ');
    for(let word of line) {
        word = word.toLowerCase();
        if(stopwords.has(word))
            title.push(word);
        else title.push(capitalizeFirstLetter(word));
    }
    return title.join(' ');
}

module.exports = {
    capitalizeFirstLetter  : capitalizeFirstLetter,
    getICRegexString : getICRegexString,
    getAbbreviation : getAbbreviation,
    getTitleForm : getTitleForm
}