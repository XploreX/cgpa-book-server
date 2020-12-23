const sw = require('stopword');

/**
 * Abbreviation is found by taking first letter in order
 * of the words(which are not stopwords) in the given string
 *
 * @param {String} str  -
 * @return {String} - Abbreviation of the string
 */
function getAbbreviation(str) {
  let line = str.split(' ');
  line = sw.removeStopwords(line);
  // console.log(line);
  let s = '';
  ignoreReg = /[&()]+/;
  for (let word of line) {
    word = word.trim();
    if (word.search(ignoreReg) != -1 || word.length === 0) {
      continue;
    }
    s += word[0].toUpperCase();
  }
  return s;
}

module.exports = getAbbreviation;
