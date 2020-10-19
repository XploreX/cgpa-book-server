const path = require('path');
const fs = require('fs');

const __ROOT = require(__dirname+'/../config.js').__ROOT;
const customRequireDirectory = require(path.join(__ROOT,'utility/custom-require-directory.js'));

module.exports = customRequireDirectory(customRequireDirectory(__dirname));
