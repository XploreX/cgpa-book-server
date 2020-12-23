const ROOT = require(__dirname + '/../../config').ROOT;
const customRequireDirectoryRoutes = require(ROOT +
  '/utility/customRequireDirectoryRoutes');

module.exports = customRequireDirectoryRoutes(__dirname);
