const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config').ROOT;
const {College} = require(ROOT + '/models/academia');
const academiaServices = require(ROOT + '/services/academia');
const academiaFields = require(ROOT + '/fields/academia');
const userFields = require(ROOT + '/fields/user');

/**
 * Create key denoting possible former name of the
 * given key
 * @param {string} key
 * @return {string} created string
 */
function possiblyFormerKey(key) {
  key = key.toLowerCase();
  key = key.slice(0).toUpperCase() + key.slice(1);
  return 'possibleFormer' + key + 'Name';
}

/**
 *
 * @param {string} key
 * @return {string} created string
 */
function getByFormerMethodName(key) {
  key = key.toLowerCase();
  key = key.slice(0).toUpperCase() + key.slice(1);
  return 'get' + key + 'ByFormerName';
}

/**
 * Replace academia values info with the corresponding IDs info.
 * @param {object} user - object containing user information
 */
function replaceAcademiaValuesWithIds(user) {
  critera = ['college', 'course', 'branch', 'seemster'];
  query = {};
  for (const criterion of critera) {
    query[possiblyFormerKey(criterion)] = user[criterion];
  }

  College.findOne(academiaServices.createFindQuery(query))
      .exec()
      .then((college) => {
        if (!college) {
          throw new CustomError(
              'Invalid user data',
              StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
        const mp = {};
        const academiaOrder = ['college', 'course', 'branch', 'semester'];
        mp['college'] = college;

        for (let i=0; i<academiaOrder.length; ++i) {
          const key = academiaOrder[i];
          if (!(key in user)) {
            break;
          }
          if (i != 0) {
            const prevKey = academiaOrder[i-1];
            mp[key] = mp[prevKey][getByFormerMethodName(key)](user[key]);
          }
          const idFieldKey = key.toUpperCase() + '_ID';
          user[userFields[idFieldKey]] = mp[key][academiaFields[idFieldKey]];
          delete user[key];
        }
      });
}

module.exports = replaceAcademiaValuesWithIds;
