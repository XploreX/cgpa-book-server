const {StatusCodes, ReasonPhrases} = require('http-status-codes');
const ROOT = require(__dirname + '/../config').ROOT;
const authenticateClientId = require(ROOT +
  '/utility/oauth/authenticateClientId');
/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @param {Object} next
 * @return {Promise}
 */
function authenticateUser(req, res, next) {
  let clientId = req.get('Authorization');
  clientId = clientId.split(' ')[1];
  // let clientId = req.body['tokenId'];
  return authenticateClientId(clientId)
      .then((payload) => {
        req.user = {};
        req.user.name = payload['name'];
        req.user.email = payload['email'];
        req.user.picture = payload['picture'];
        next();
      })
      .catch((err) => {
        err.statusCode = StatusCodes.UNAUTHORIZED;
        err.name = ReasonPhrases.UNAUTHORIZED;
        next(err);
      });
}

module.exports = authenticateUser;
