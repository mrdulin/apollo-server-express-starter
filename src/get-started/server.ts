import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import cors from 'cors';
import casual from 'casual';
import shortid from 'shortid';
import http from 'http';

import { logger } from '../utils';
import { config } from '../config';

interface IBook {
  id: string;
  title: string;
  author: string;
}

const books: IBook[] = [
  { id: shortid.generate(), title: casual.title, author: casual.name },
  { id: shortid.generate(), title: casual.title, author: casual.name }
];

const typeDefs: string = `
  type Book {
    id: ID!
    title: String
    author: String
  }

  type Query {
    books: [Book]!
  }
`;

const resolvers: IResolvers = {
  Book: {
    title: (book: IBook): string => {
      return book.title.toUpperCase();
    }
  },
  Query: {
    books: (): Promise<IBook[]> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 2000);
      });
    }
  }
};

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  app.use(cors());
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
