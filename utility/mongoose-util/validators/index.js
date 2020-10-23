const ROOT = require(__dirname + '/../../../config.js').ROOT;
const customRequireDirectory = require(ROOT+'/utility/customRequireDirectory');

module.exports = customRequireDirectory(__dirname);