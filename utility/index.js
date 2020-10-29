const path = require('path');
const fs = require('fs');

const ROOT = require(__dirname+'/../config').ROOT;
const customRequireDirectory = require(path.join(ROOT,'utility/customRequireDirectory'));

module.exports = customRequireDirectory(__dirname);
