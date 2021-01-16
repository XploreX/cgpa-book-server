const express = require('express');
const {StatusCodes} = require('http-status-codes');

const config = require(__dirname + '/../../config');
const utility = require(config.ROOT + '/utility');
const CustomError = require(config.ROOT + '/CustomError');

const customRequireDirectoryRoutes = require(config.ROOT +
  '/utility/customRequireDirectoryRoutes');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/*', (req, res, next) => {
  const query = req.query;
  utility.requestUtil.prepareQuery(query);
  next();
});

router.post('/*', (req, res, next) => {
  let authorizationHeader = req.get('Authorization');
  let credentials = '';
  if (authorizationHeader) {
    authorizationHeader = authorizationHeader.split(' ');
    credentials = authorizationHeader[1] || '';
  }
  if (credentials !== config.API_SECRET) {
    throw new CustomError(
        'Incorrect or missing credentials',
        StatusCodes.UNAUTHORIZED,
    );
  }
  next();
});

module.exports = customRequireDirectoryRoutes(__dirname, true, router);
