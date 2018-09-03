import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import http from 'http';

import { logger } from '../utils';
import { config } from '../config';

interface IBook {
  id: string;
  title: string;
  author: string;
}

const books: IBook[] = [
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

const typeDefs: string = `
  type Query {
    books: [Book]!
    bookById(id: ID!): Book
  }
  type Book {
    id: ID!
    title: String
    author: String
  }
`;

const resolvers: IResolvers = {
  Query: {
    books: () => books,
    bookById: (root, args) => books.find(book => book.id === args.id)
  }
};

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  app.use(config.GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress({ schema }));
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start, schema, resolvers, IBook, books };
