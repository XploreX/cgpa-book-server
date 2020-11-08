const path = require('path');

const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname+'/../../config').ROOT;
const http = require(path.join(ROOT,'utility/http-util'));
const CustomError = require(ROOT + '/CustomError');

function handleIfModifiedSince(req,res,lastModified) {
    if(req.get(http.headers.IF_MODIFIED_SINCE)) {
        if(req.get(http.headers.IF_MODIFIED_SINCE) === lastModified) {
            res.sendStatus(StatusCodes.NOT_MODIFIED);
            let err=new CustomError(null,StatusCodes.NOT_MODIFIED);
            return Promise.reject(err);
        }
        else 
            return Promise.resolve(lastModified);
    }
}

module.exports = handleIfModifiedSince;