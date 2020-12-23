/**
 * Print error and throws
 * @param {Error} err
 * @param {String} message
 * @throws
 */
function basicErrorHandler(err, message = null) {
  if (message) {
    console.log(message);
  } else {
    console.log('Error occured');
  }
  throw err;
}

module.exports = basicErrorHandler;
