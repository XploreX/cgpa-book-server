const sw = require('stopword');

stopwordsTemp = sw.en;
stopwords = new Set();

for(word of stopwordsTemp) {
    stopwords.add(word);
}

stopwords.delete('i');

module.exports = stopwords;