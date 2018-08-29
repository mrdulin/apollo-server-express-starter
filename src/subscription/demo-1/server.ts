import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLSchema } from 'graphql';
import cors from 'cors';

import { logger, toJson } from '../../utils';
import { findUserByUserType } from './db';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

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
  const port = 4000;
  const wsPath = '/subscriptions';
  const subscriptionsEndpoint = `ws://localhost:${port}${wsPath}`;

  const server = http.createServer(app);

  server.listen(port, err => {
    if (err) {
      throw new Error(err);
    }
    logger.info(`Go to http://localhost:${port}/graphiql to run queries!`);

    const ss = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams, webSocket, context) => {
          logger.info(`onConnect - connectionParams: ${toJson(connectionParams)}`);

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
          logger.info(`onOperation - params: ${toJson(params)}, message: ${toJson(message)}`);
          return params;
        },
        onOperationComplete: webSocket => {
          logger.info('onOperationDone');
        },
        onDisconnect: (webSocket, context) => {
          logger.info('onDisconnect');
        }
      },
      {
        server,
        path: wsPath
      }
    );
  });

  app.use(cors(), auth);
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress((req?: express.Request) => {
      return {
        schema,
        context: {
          user: (req as any).user
        },
        subscriptionsEndpoint
      };
    })
  );
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql', subscriptionsEndpoint }));
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
