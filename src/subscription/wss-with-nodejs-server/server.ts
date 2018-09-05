import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLSchema } from 'graphql';

import { db } from './db';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { config } from '../../config';
import { logger } from '../../utils';

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

function createSubscriptionServer(server: http.Server | https.Server) {
  const ss: SubscriptionServer = new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: connectionParams => {
        logger.info('onConnect');
        logger.info({ label: connectionParams, msg: connectionParams });
        return connectionParams;
      },
      onOperation: (message, params) => {
        logger.info('onOperation');
        return {
          ...params,
          context: {
            ...params.context
          }
        };
      },
      onOperationComplete: () => {
        logger.info('onOperationComplete');
      },
      onDisconnect: () => {
        logger.info('onDisconnect');
      }
    },
    { server, path: config.WEBSOCKET_ROUTE }
  );
}

async function start() {
  const app: express.Application = express();
  const serverOptions: https.ServerOptions = {
    cert: fs.readFileSync(path.resolve(__dirname, '../../../ssl/cert.pem')),
    key: fs.readFileSync(path.resolve(__dirname, '../../../ssl/key.pem'))
  };
  const httpsServer: https.Server = https.createServer(serverOptions, app);
  const httpServer: http.Server = http.createServer(app);

  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress(() => {
      return {
        schema,
        context: {
          db
        }
      };
    })
  );
  app.use(
    config.GRAPHIQL_ROUTE,
    graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE, subscriptionsEndpoint: config.WEBSOCKET_ENDPOINT })
  );

  httpsServer.listen(config.HTTPS_PORT, () => {
    createSubscriptionServer(httpsServer);
    logger.info(`Go to https://${config.HOST}:${config.PORT}/${config.GRAPHQL_ROUTE} to run queries!`);
  });

  httpServer.listen(config.PORT, () => {
    createSubscriptionServer(httpServer);
    logger.info(`Go to http://${config.HOST}:${config.PORT}/${config.GRAPHQL_ROUTE} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
