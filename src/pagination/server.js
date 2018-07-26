const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');

const { mongooseConnect } = require('./connector/mongodb');
const { lowdb } = require('./connector/lowdb');

const { Book } = require('./models/Book');

const { resolvers } = require('./resolvers');
const { typeDefs } = require('./typeDefs');

const schema = makeExecutableSchema({ typeDefs, resolvers });

mongooseConnect();

const app = express();
app.use(cors());
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      connectors: {
        lowdb
      },
      models: {
        Book
      }
    }
  })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
