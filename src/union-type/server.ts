import express from 'express';
import bodyParser from 'body-parser';
import {
  graphqlExpress,
  graphiqlExpress,
  ExpressGraphQLOptionsFunction,
  GraphQLOptions
} from 'apollo-server-express';
import cors from 'cors';
import http from 'http';

import { logger } from '../utils';
import { config } from '../config';
import { schema } from './schema';
import { lowdb } from './db';

async function start(): Promise<http.Server> {
  const app: express.Application = express();

  const optionsFunction: ExpressGraphQLOptionsFunction = _ => {
    const options: GraphQLOptions = {
      schema,
      context: {
        lowdb
      }
    };
    return options;
  };
  app.use(cors());
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress(optionsFunction)
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
