import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import cors from 'cors';
import http from 'http';
import { LoDashExplicitSyncWrapper } from 'lowdb';

import { seed } from './db';
import { config } from '../config';
import { logger } from '../utils';
import { Book, User } from './graphql/models';
import { schema } from './graphql/modules';

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  const db: LoDashExplicitSyncWrapper<any> = await seed();

  app.use(cors());
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress({
      schema,
      context: {
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
