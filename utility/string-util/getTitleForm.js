const stopwords = require('./stopwords.js');

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

module.exports = getTitleForm;