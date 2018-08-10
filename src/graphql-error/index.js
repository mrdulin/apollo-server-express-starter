const { GraphQLError } = require('graphql');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');

const typeDefs = `
  type Query {
    books: [Book]
  }

  type Book {
    id: ID!,
    title: String,
    author: String
  }
`;

const resolvers = {
  Query: {
    books: () => {
      throw new GraphQLError('something bad happened');
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: {
    log: e => console.log(e)
  }
});

const app = express();
app.use(cors());
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      formatError: err => {
        console.log('format error');
        return err;
      }
    };
  })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
