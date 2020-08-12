const { MongoError } = require("mongodb");

function logErrors(err,req,res,next) {
    console.log(err);
    next(err);
}

function genericErrorHandler(err,req,res,next) {
    if(err instanceof TypeError) {
        err.status = 400;
        err.type = 'TypeError';
    }
    else if(err instanceof MongoError) {
        err.status = 500;
        err.type = 'MongoError';
    }
    else {
        next(err);
    }
    res.status(err.status).json({
        type : err.type,
        message : err.message
    });
}


module.exports = {
    logErrors : logErrors,
    genericErrorHandler : genericErrorHandler
}