const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

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
    bookById(id: ID!): Book
  }
  type Book {
    title: String,
    author: String
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    bookById: (source, args, ctx) => books.find(book => book.id === args.id)
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

function start(done) {
  const app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  return app.listen(3000, () => {
    if (done) done();
    console.log('Go to http://localhost:3000/graphiql to run queries!');
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
