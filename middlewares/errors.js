const { MongoError } = require("mongodb");

function notFoundHandler(req, res, next) {
    err = new Error("Content not found");
    err.status = 404;
    next(err);
}

function logErrors(err, req, res, next) {
    console.log(err);
    next(err);
}

function genericErrorHandler(err, req, res, next) {
    if (!('status' in err)) {
        if (err instanceof TypeError || err.code == 11000) {    //error code 11000 is mongodb duplicate key error 
            err.status = 400;
            err.type = 'TypeError';
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