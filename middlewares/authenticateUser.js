const ROOT = require(__dirname + '/../config').ROOT;
const authenticateClientId = require(ROOT + '/utility/oauth/authenticateClientId');
const CustomError = require(ROOT + '/CustomError');

function authenticateUser(req,res,next) {
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
        err.statusCode = 401;
        err.name = CustomError.NAME_AUTHENTICATION_ERROR;
        next(err);
    })    
}

module.exports = authenticateUser;