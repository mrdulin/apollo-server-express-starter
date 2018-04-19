const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const schema = require('./schema');
const { PORT } = require('../config');

function start(done) {
  const app = express();

  function morganFormat(tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      JSON.stringify(req.body),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms'
    ].join(' ');
  }

  app.use(
    bodyParser.json(),
    morgan(morganFormat, {
      stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    })
  );

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  const server = app.listen(PORT, () => {
    if (done) done();
    console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
  });

  return server;
}

console.log('process.env.NODE_ENV: %s', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
