const {StatusCodes} = require('http-status-codes');
const ROOT = require(__dirname + '/../../config').ROOT;
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
  key = key.slice(0, 1).toUpperCase() + key.slice(1);
  return 'get' + key + 'ById';
}

/**
 * Replace academia ids info with the corresponding values info.
 * @param {object} user object containing user information
 * @return {object}
 */
function replaceAcademiaIdsWithValues(user) {
  return College.findOne(academiaServices.createFindQuery(user))
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

        // initialize all academia value fields
        for (const item of academiaOrder) {
          const key = academiaFields[item.toUpperCase()];
          user[key] = '';
        }

        mp['college'] = college;
        for (let i=0; i<academiaOrder.length; ++i) {
          const key = academiaOrder[i];
          const keyIdField = userFields[key.toUpperCase() + '_ID'];
          if (!user[keyIdField]) {
            break;
          }
          if (i!=0) {
            const prevKey = academiaOrder[i-1];
            mp[key] = mp[prevKey][getByIdMethodName(key)](user[keyIdField]);
          }
          const value = mp[key][key];
          user[academiaFields[key.toUpperCase()]] = value;
        }

        // clean up
        for (const item of academiaOrder) {
          const keyIdField = userFields[item.toUpperCase() + '_ID'];
          if (keyIdField in user) {
            delete user[keyIdField];
          }
        }
        return user;
      });
}

module.exports = replaceAcademiaIdsWithValues;
