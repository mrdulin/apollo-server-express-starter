const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { ApolloEngine } = require('apollo-engine');
const http = require('http');

const schema = require('./schema');

const engine = new ApolloEngine({
  apiKey: 'service:mrdulin-2238:cTtdtgOGmeUfW5oRjcde-g'
});
const app = express();
const port = 3000;

function start(done) {
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema,
      tracing: true,
      cacheControl: true
    })
  );
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  engine.listen(
    {
      port,
      expressApp: app
    },
    () => {
      if (done) done();
      console.log(`Go to http://localhost:${port}/graphiql to run queries!`);
    }
  );
}

function stop(eng) {
  return eng.stop();
}

module.exports = {
  engine,
  port,
  start,
  stop
};
