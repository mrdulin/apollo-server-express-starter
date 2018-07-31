const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const { REMOTE_PORT } = require('./config');

const githuntLink = new HttpLink({ uri: 'http://api.githunt.com/graphql', fetch });
const remoteServerLink = new HttpLink({ uri: `http://localhost:${REMOTE_PORT}/graphql`, fetch });

module.exports = {
  githuntLink,
  remoteServerLink
};
