import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { GraphQLOptions } from 'apollo-server-core';
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

    "book id"
    id: ID!

    """book title"""
    title: String

    # book author
    author: String

    """
    book name
    It's deprecated
    """
    name: String @deprecated(reason: "Use title instead.")
  }
`;

const resolvers: IResolvers = {
  Query: {
    books: (): IBook[] => books,
    bookById: (root, args): IBook | undefined => books.find((book: IBook): boolean => book.id === args.id)
  }
};

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  const graphqlOptions: GraphQLOptions = {
    schema,
    tracing: process.env.NODE_ENV === 'development'
  };
  app.use(config.GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress(graphqlOptions));
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start, schema, resolvers, IBook, books };
