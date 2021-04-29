const {StatusCodes} = require('http-status-codes');

const ROOT = require(__driname + '/../../config');
const academiaServices = require(ROOT + '/services/academia');
const {College} = require(ROOT + '/models/academia');
const CustomError = require(ROOT + '/CustomError');
const academiaFields = require(ROOT + '/fields/academia');
const userFields = require(ROOT + '/fields/user');

/**
 *
 * @param {string} key
 * @return {string} created string
 */
function getByIdMethodName(key) {
  key = key.toLowerCase();
  key = key.slice(0).toUpperCase() + key.slice(1);
  return 'get' + key + 'ById';
}

/**
 * Replace academia ids info with the corresponding values info.
 * @param {object} user object containing user information
 */
function replaceAcademiaIdsWithValues(user) {
  College.findOne(academiaServices.createFindQuery(user))
      .exec()
      .then((college) => {
        if (!college) {
          throw new CustomError(
              'Invalid user data',
              StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }

        const academiaOrder = ['college', 'course', 'branch', 'semester'];
        const mp = {};
        mp['college'] = college;

        for (let i=0; i<academiaOrder.length; ++i) {
          const key = academiaOrder[i];
          const keyIdField = userFields[key.toUpperCase() + '_ID'];
          if (!keyIdField) {
            break;
          }
          if (i!=0) {
            const prevKey = academiaOrder[i-1];
            mp[key] = mp[prevKey][getByIdMethodName(key)](user[keyIdField]);
          }
          const value = mp[key][key];
          key = key.toUpperCase();
          user[academiaFields[key]] = value;
          delete user[keyIdField];
        }
      });
}

module.exports = replaceAcademiaIdsWithValues;
