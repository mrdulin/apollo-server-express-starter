import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import casual from 'casual';
import shortid from 'shortid';
import { GraphQLSchema } from 'graphql';
import http from 'http';

import { config } from '../config';
import { logger } from '../utils';

export const bookId1: string = shortid.generate();
export const bookId2: string = shortid.generate();

const db = {
  books: [
    { id: bookId1, title: casual.title, author: casual.name },
    { id: bookId2, title: casual.title, author: casual.name }
  ]
};

const typeDefs: string = `
  type Book {
    id: ID!
    title: String
    author: String
  }

  type Query {
    books: [Book]!
    bookById(id: ID!): Book
  }
`;

const resolvers: IResolvers = {
  Query: {
    books: () => db.books,
    bookById: (root, args, ctx) => db.books.find(book => book.id === args.id)
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

export { start };
