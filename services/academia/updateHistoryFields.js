const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

/**
 * Recursively update history fields to add current academia values
 * in academia document.
 * @param {object} doc mongodb document
 */
function updateHistoryKeys(doc) {
  const academiaOrder = [
    'college',
    'course',
    'branch',
    'semester',
    'subject',
  ];
  for (let i = 0; i < academiaOrder.length; ++i) {
    const item = academiaOrder[i];
    const key = academiaFields[item.toUpperCase()];
    const keyHistoryField =
      academiaFields[key.toUpperCase() + '_NAME_HISTORY'];
    if (key in doc) {
      if (!doc[keyHistoryField]) {
        doc[keyHistoryField] = [];
      }
      doc[keyHistoryField].push(doc[key]);
      if (i != academiaOrder.length - 1) {
        const nextKey = academiaFields[academiaOrder[i + 1].toUpperCase()];

        let nextKeyPlural = nextKey;
        if (nextKey == academiaFields['BRANCH']) {
          nextKeyPlural += 'e';
        }
        nextKeyPlural += 's';

        for (const nestedItem of doc[nextKeyPlural]) {
          updateHistoryKeys(nestedItem);
        }
      }
      break;
    }
  }
}

module.exports = updateHistoryKeys;
