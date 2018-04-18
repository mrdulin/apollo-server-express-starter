const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
    publishDate: new Date()
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    publishDate: new Date()
  }
];

const typeDefs = `
  scalar Date

  type Book { 
    title: String 
    author: String 
    publishDate: Date 
  }

  type Query { 
    books: [Book]
    bookByDate(date: Date): [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    bookByDate: (root, args, ctx) => books
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  })
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
