const path = require('path');

const ROOT = require(__dirname+'/../../config').ROOT;
const customRequireDirectory = require(path.join(ROOT,'utility/customRequireDirectory.js'));

module.exports = customRequireDirectory(__dirname);