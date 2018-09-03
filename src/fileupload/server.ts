import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import cors from 'cors';
import { apolloUploadExpress } from 'apollo-upload-server';
import http from 'http';
import path from 'path';

import { schema } from './schema';
import { lowdb, collections } from './db';
import { logger } from '../utils';
import { config } from '../config';
import { Upload } from './models';

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  app.use(cors());
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    apolloUploadExpress(),
    graphqlExpress({
      schema,
      context: {
        db: lowdb,
        Upload: new Upload({ dir: path.resolve(__dirname, '../../uploads'), collectionName: collections.uploads })
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
