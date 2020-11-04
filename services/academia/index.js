const ROOT = require(__dirname + '/../../config/app').ROOT;
const customRequireDirectory = require(ROOT+'/utility/customRequireDirectory');

module.exports = customRequireDirectory(__dirname);