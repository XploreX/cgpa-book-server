const {StatusCodes} = require('http-status-codes');
const { MongoError } = require("mongodb");

function notFoundHandler(req, res, next) {
    err = new Error("Content not found");
    err.status = 404;
    next(err);
}

function logErrors(err, req, res, next) {
    if('status' in err) {
        if(err.status === httpHelpers.STATUS_NOT_MODIFIED)
            return next(err);
    }
    console.log(err);
    next(err);
}

function genericErrorHandler(err, req, res, next) {


    if (!('status' in err)) {
        if (err instanceof TypeError || err.name == 'TypeError' ) { 
            err.status = 400;
            err.type = 'TypeError';
        }
        else if(err.code == 11000 || err.name == 'ValidationError' || err.name == 'ValueError') {      //error code 11000 is mongodb duplicate key error 
            err.status = 400;
            err.type = 'ValueError';
        }
        else if (err instanceof MongoError || err.name == 'MongoError') {
            err.status = 500;
            err.type = 'MongoError';
        }
        else {
            err.status = 503;
            next(err);
        }
    }
    if(err.status === httpHelpers.STATUS_NOT_MODIFIED)
        return;
    res.status(err.status).json({
        type: err.type,
        message: err.message
    });
}


module.exports = {
    logErrors: logErrors,
    genericErrorHandler: genericErrorHandler,
    notFoundHandler : notFoundHandler
}