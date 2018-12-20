import express from 'express';
import bodyParser from 'body-parser';
import {
  graphqlExpress,
  graphiqlExpress,
  GraphQLOptions
} from 'apollo-server-express';
import { GraphQLScalarType, Kind, GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { lowdb } from './db';

import { logger } from '../utils';
import { config } from '../config';

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function start() {
  const app: express.Application = express();
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress(
      (req): GraphQLOptions => {
        return {
          schema,
          context: {
            db: lowdb
          }
        };
      }
    )
  );
  app.use(
    config.GRAPHIQL_ROUTE,
    graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE })
  );
  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
