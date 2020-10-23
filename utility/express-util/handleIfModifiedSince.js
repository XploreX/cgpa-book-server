const path = require('path');

const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname+'/../../config.js').ROOT;
const http = require(path.join(ROOT,'utility/http-util'));

function handleIfModifiedSince(req,res,lastModified) {
    if(req.get(http.headers.IF_MODIFIED_SINCE)) {
        if(req.get(http.headers.IF_MODIFIED_SINCE) === lastModified) {
            res.sendStatus(StatusCodes.NOT_MODIFIED);
            let err=new Error();
            err.status = StatusCodes.NOT_MODIFIED;
            throw err;
        }
    }
}

module.exports = handleIfModifiedSince;