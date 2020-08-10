function basicErrorHandler(err) {
    console.log("Error occured");
    throw err;
}

module.exports = {
    basicErrorHandler : basicErrorHandler
}