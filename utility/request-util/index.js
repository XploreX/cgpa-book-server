const path = require('path');

const config = require(__dirname + '/../../config');
const ROOT = config.ROOT;
const customRequireDirectory = require(path.join(ROOT,'utility/customRequireDirectory.js'));

module.exports = customRequireDirectory(__dirname);