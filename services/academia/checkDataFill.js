const ROOT = require(__dirname + '/../../config').ROOT;
const CustomError = require(ROOT + '/CustomError');

function checkDataFill(queryRes) {
  if (queryRes.nModified === 0) {
    throw new CustomError('data already exists', 400);
  }
  return Promise.resolve(true);
}

module.exports = checkDataFill;
