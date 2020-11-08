const path = require('path');

const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname+'/../../config').ROOT;
const http = require(path.join(ROOT,'utility/http-util'));
const CustomError = require(ROOT + '/CustomError');

function handleIfModifiedSince(req,res,lastModified) {
    if(req.get(http.headers.IF_MODIFIED_SINCE)) {
        console.log(req.get(http.headers.IF_MODIFIED_SINCE))
        console.log(lastModified)
        if(req.get(http.headers.IF_MODIFIED_SINCE) === lastModified) {
            console.log("sending 304")
            res.sendStatus(StatusCodes.NOT_MODIFIED);
            let err=new CustomError(null,StatusCodes.NOT_MODIFIED);
            return Promise.reject(err);
        }
        else {
            console.log("sending resolve")
            return Promise.resolve(lastModified);
        }
    }
}

module.exports = handleIfModifiedSince;