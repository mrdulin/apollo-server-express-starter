const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { ApolloEngine } = require('apollo-engine');

const schema = require('./schema');

const engine = new ApolloEngine({
  apiKey: 'service:mrdulin-2238:cTtdtgOGmeUfW5oRjcde-g'
});

const app = express();

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
    port: 3000,
    expressApp: app
  },
  () => {
    console.log('Go to http://localhost:3000/graphiql to run queries!');
  }
);
