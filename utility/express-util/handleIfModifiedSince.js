const path = require('path');

const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname+'/../../config').ROOT;
const http = require(path.join(ROOT,'utility/http-util'));
const CustomError = require(ROOT + '/CustomError');

function handleIfModifiedSince(req,res,lastModified) {
    lastModified = Date.parse(lastModified);
    if(req.get(http.headers.IF_MODIFIED_SINCE)) {
        let ifModifiedSince = Date.parse(req.get(http.headers.IF_MODIFIED_SINCE));
        if(ifModifiedSince >= lastModified) {
            res.sendStatus(StatusCodes.NOT_MODIFIED);
            let err=new CustomError(null,StatusCodes.NOT_MODIFIED);
            throw err;
        }
    }
}

module.exports = handleIfModifiedSince;