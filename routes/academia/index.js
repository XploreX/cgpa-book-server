const express = require('express');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const customRequireDirectoryRoutes = require(ROOT + '/utility/customRequireDirectoryRoutes');
var router = express.Router();

router.get('/*', (req, res, next) => {
    let query = req.query;
    utility.requestUtil.prepareQuery(query);
    next();
})

module.exports = customRequireDirectoryRoutes(__dirname,true,router);
