const rp = require('request-promise');

function request(port, body) {
  const options = {
    method: 'POST',
    uri: `http://localhost:${port}/graphql`,
    body,
    // body: JSON.stringify(body),
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return rp(options);
}

module.exports = request;
