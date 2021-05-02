const {StatusCodes} = require('http-status-codes');
const _ = require('lodash');
const ROOT = require(__dirname + '/../../config').ROOT;
const {College} = require(ROOT + '/models/academia');
const academiaServices = require(ROOT + '/services/academia');
const academiaFields = require(ROOT + '/fields/academia');
const userFields = require(ROOT + '/fields/user');
const CustomError = require(ROOT + '/CustomError');

/**
 * Create key denoting possible former name of the
 * given key
 * @param {string} key
 * @return {string} created string
 */
function possiblyFormerKey(key) {
  key = key.toLowerCase();
  key = key.substring(0, 1).toUpperCase() + key.substring(1);
  return 'possiblyFormer' + key + 'Name';
}

/**
 *
 * @param {string} key
 * @return {string} created string
 */
function getByFormerMethodName(key) {
  key = key.toLowerCase();
  key = key.substring(0, 1).toUpperCase() + key.substring(1);
  return 'get' + key + 'ByFormerName';
}

/**
 * Replace academia values info with the corresponding IDs info.
 * @param {object} user - object containing user information
 * @return {promise}
 */
function replaceAcademiaValuesWithIds(user) {
  critera = ['college', 'course', 'branch', 'semster'];
  query = {};
  for (const criterion of critera) {
    user[criterion] = new RegExp(_.escapeRegExp(user[criterion]), 'i');
    query[possiblyFormerKey(criterion)] = user[criterion];
  }

  return College.findOne(academiaServices.createFindQuery(query))
      .exec()
      .then((college) => {
        if (!college) {
          throw new CustomError(
              'Invalid user data',
              StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
        const mp = {};
        const academiaOrder = ['college', 'course', 'branch'];

        mp['college'] = college;
        for (let i = 0; i < academiaOrder.length; ++i) {
          const key = academiaFields[academiaOrder[i].toUpperCase()];
          if (!user[key]) {
            break;
          }
          if (i != 0) {
            const prevKey =
            academiaFields[academiaOrder[i - 1].toUpperCase()];
            mp[key] = mp[prevKey][getByFormerMethodName(key)](user[key]);
          }
          const keyIdField = key.toUpperCase() + '_ID';
          user[userFields[keyIdField]] = mp[key][academiaFields[keyIdField]];
        }

        // clean up
        for (const item of academiaOrder) {
          const key = academiaFields[item.toUpperCase()];
          if (key in user) {
            delete user[key];
          }
        }

        return user;
      });
}

module.exports = replaceAcademiaValuesWithIds;
