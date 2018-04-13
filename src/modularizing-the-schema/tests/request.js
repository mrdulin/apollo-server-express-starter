const rp = require('request-promise');

function RequestFactory(port) {
  const uri = `http://localhost:${port}/graphql`;
  function post(body) {
    const options = {
      method: 'POST',
      uri,
      body,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return rp(options);
  }

  function get(qs) {
    const options = {
      uri,
      qs,
      json: true
    };
    return rp(options);
  }
  return {
    post,
    get
  };
}

module.exports = RequestFactory;
