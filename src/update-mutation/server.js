const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');

const { resolvers } = require('./resolvers');
const { typeDefs } = require('./typeDefs');

const { lowdb } = require('./db');
const { PORT } = require('../config');

const schema = makeExecutableSchema({ typeDefs, resolvers });

function start(done) {
  const app = express();
  app.use(cors());
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema,
      context: {
        lowdb
      }
    })
  );
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  return app.listen(PORT, () => {
    if (done) done();
    console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
