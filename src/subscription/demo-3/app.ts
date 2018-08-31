import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLSchema } from 'graphql';
import cluster from 'cluster';

import { logger, toJson } from '../../utils';
import { config } from '../../config';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { createLowdb } from './db';

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });
const { lowdb, authorId1, authorId2 } = createLowdb();

function start() {
  const app = express();
  const server = http.createServer(app);

  server.listen(config.PORT, err => {
    if (err) {
      throw new Error(err);
    }
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);

    const ss = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams, webSocket, context) => {
          logger.info('onConnect');
          logger.info(`connectionParams: ${toJson(connectionParams)}`);

          // 这里返回的对象会被传入onOperation的params.context
          return {
            user: { id: authorId2 }
          };
        },
        onOperation: (message, params, webSocket) => {
          logger.info('onOperation');

          // 这里要在上下文加入和graphqlExpress一样的model和connector，为了graphql subscription返回类型的非标量类型字段的解析
          // 如果这里不返回上下文，则在book.author的resolver中的context是undefined
          return {
            ...params,
            context: {
              ...params.context,
              db: lowdb
            }
          };
        },
        onOperationComplete: webSocket => {
          logger.info('onOperationComplete');
        },
        onDisconnect: (webSocket, context) => {
          logger.info('onDisconnect');
        }
      },
      { server, path: config.WEBSOCKET_ROUTE }
    );
  });
  app.use((req: any, res, next) => {
    req.user = { id: authorId1 };
    next();
  });
  app.use((req, res, next) => {
    if (cluster.isWorker) {
      logger.info(`Worker ${cluster.worker.id} received request`);
    }
    next();
  });
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress((req: any) => {
      return {
        schema,
        context: {
          db: lowdb,
          user: req.user
        }
      };
    })
  );
  app.use(
    config.GRAPHIQL_ROUTE,
    graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE, subscriptionsEndpoint: config.WEBSOCKET_ENDPOINT })
  );
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
