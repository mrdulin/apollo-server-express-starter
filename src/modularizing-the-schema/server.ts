import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import http from 'http';

import { schema } from './schema';
import { logger } from '../utils';
import { config } from '../config';
import { lowdb } from './db';
import { FortuneCookie } from './connectors';

async function start(): Promise<http.Server> {
  const app: express.Application = express();

  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress({
      schema,
      tracing: true,
      context: {
        db: lowdb,
        FortuneCookie
      }
    })
  );
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
