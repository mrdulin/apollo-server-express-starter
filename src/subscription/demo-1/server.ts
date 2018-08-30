import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLSchema } from 'graphql';
import cors from 'cors';

import { logger } from '../../utils';
import { findUserByUserType, db } from './db';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { config } from '../../config';

function auth(req, res, next) {
  const { authorization } = req.headers;
  const parts = authorization.split(' ');
  const bearer = parts[0];
  const credential = parts[1];

  if (/^Bearer$/i.test(bearer) && credential) {
    req.user = {
      userType: credential
    };
  }
  next();
}

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

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
          logger.info({ label: 'connectionParams', msg: connectionParams });

          const { token } = connectionParams;
          const parts = token.split(' ');
          const bearer = parts[0];
          const credential = parts[1];
          if (/^Bearer$/i.test(bearer) && credential) {
            const subscribeUser = findUserByUserType(credential);
            return {
              user: subscribeUser
            };
          }

          throw new Error('Missing auth token!');
        },
        onOperation: (message, params, webSocket) => {
          // https://github.com/apollographql/subscriptions-transport-ws/issues/300
          logger.info('onOperation');
          logger.info({ label: 'params', msg: params });
          logger.info({ label: 'message', msg: message });
          return {
            ...params,
            context: {
              ...params.context,
              db
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
      {
        server,
        path: config.WEBSOCKET_ROUTE
      }
    );
  });

  app.use(cors(), auth);
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress((req?: express.Request) => {
      return {
        schema,
        context: {
          user: (req as any).user
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
