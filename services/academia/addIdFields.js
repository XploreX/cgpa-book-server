const ROOT = require(__dirname + '/../../config').ROOT;
const mongoose = require('mongoose');

const academiaFields = require(ROOT + '/fields/academia');

/**
 * Recursively add/update id fields to unique values in
 * academia document
 * @param {object} doc mongodb document
 */
function addIdFields(doc) {
  const academiaOrder = ['college', 'course', 'branch', 'semester', 'subject'];
  for (let i=0; i<academiaOrder.length; ++i) {
    const item = academiaOrder[i];
    const key = academiaFields[item.toUpperCase()];
    const keyIdField = academiaFields[item.toUpperCase() + '_ID'];
    if (key in doc) {
      if (!doc[keyIdField]) {
        doc[keyIdField] = new mongoose.Types.ObjectId();
      }
      if (i != academiaOrder.length - 1) {
        const nextKey = academiaFields[academiaOrder[i+1].toUpperCase()];
        // calculating plural of next key
        let nextKeyPlural=nextKey;
        if (nextKey == academiaFields['BRANCH']) {
          nextKeyPlural+='e';
        }
        nextKeyPlural+='s';
        for (const nestedItem of doc[nextKeyPlural]) {
          addIdFields(nestedItem);
        }
      }
      break;
    }
  }
}

module.exports = addIdFields;
