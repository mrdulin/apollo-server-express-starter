const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');

// Some fake data
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

// The GraphQL schema in string form
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

// The resolvers
const resolvers = {
  Book: {
    title: book => {
      return book.title.toUpperCase();
    }
  },
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

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: {
    log: e => console.log(e)
  }
});

// Initialize the app
const app = express();

app.use(cors());
// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
