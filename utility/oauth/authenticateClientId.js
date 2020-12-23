const {OAuth2Client} = require('google-auth-library');

const config = require(__dirname + '/../../config');

const client = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
});

/**
 *
 * @param {String} clientId -
 * @return {Object} - returns payload
 */
async function authenticateClientId(clientId) {
  const ticket = await client.verifyIdToken({
    idToken: clientId,
    audience: config.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

module.exports = authenticateClientId;
