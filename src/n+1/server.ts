import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import DataLoader from 'dataloader';
import http from 'http';
import { LoDashExplicitSyncWrapper } from 'lowdb';

import { seed } from './db';
import { config } from '../config';
import { logger } from '../utils';
import { Book, User } from './graphql/models';

const typeDefs = `
  type Query {
    books: [Book]
  }

  type Author {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    author: Author
  }
`;

const dataloaders = () => {
  return {
    userById: new DataLoader(ids => getUsersById(ids))
  };
};

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const db: LoDashExplicitSyncWrapper<any> = await seed();

  app.use(cors());
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress({
      schema,
      context: {
        dataloaders: dataloaders(),
        models: {
          User: User({ db }),
          Book: Book({ db })
        }
      }
    })
  );
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));
  return app.listen(config.PORT, () => {
    logger.info(`Running a GraphQL API server at ${config.GRAPHQL_ENDPOINT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
