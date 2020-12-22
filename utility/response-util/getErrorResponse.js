/**
 *
 * @param {Error} err - error object
 * @return {Object} - error response object to send as api response
 */
function getErrorResponse(err) {
  const mp = {};
  mp.error = {};
  mp.error.type = err.name;
  mp.error.message = err.message;
  return mp;
}

module.exports = getErrorResponse;
