const stopwords = require('./stopwords.js');

/**
 * Capitalize first letter of all words which are not stopwords
 * @param {String} str -
 * @return {String} - Title form of the given string
 */
function getTitleForm(str) {
  const title = [];
  const line = str.split(' ');
  for (let word of line) {
    word = word.toLowerCase();
    if (stopwords.has(word)) {
      title.push(word);
    } else title.push(capitalizeFirstLetter(word));
  }
  return title.join(' ');
}

module.exports = getTitleForm;
