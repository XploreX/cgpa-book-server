const path = require('path');

const config = require(__dirname + '/../../config.js');
const __ROOT = config.__ROOT;
const customRequireDirectory = require(path.join(__ROOT,'utility/custome-require-directory'));

module.exports = customRequireDirectory(__dirname);