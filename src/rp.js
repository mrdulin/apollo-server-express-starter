const requestPromise = require('request-promise');
const { PORT } = require('./config');

const GRAPHQL_ENDPOINT = `http://localhost:${PORT}/graphql`;

function rp(options) {
  function post(body) {
    return requestPromise(GRAPHQL_ENDPOINT, {
      method: 'POST',
      body,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  function get(qs) {
    return requestPromise(GRAPHQL_ENDPOINT, {
      method: 'GET',
      qs,
      json: true
    });
  }

  return {
    post,
    get
  };
}

module.exports = rp;
