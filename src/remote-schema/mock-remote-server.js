const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');

const { REMOTE_PORT } = require('./config');

const books = [
  {
    id: '1',
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  },
  {
    id: '2',
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

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
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 2000);
      });
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
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(REMOTE_PORT, () => {
  console.log(`Go to http://localhost:${REMOTE_PORT}/graphiql to run queries!`);
});
