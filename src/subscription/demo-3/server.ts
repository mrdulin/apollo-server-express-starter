import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import shortid from 'shortid';
import casual from 'casual';

import { logger } from '../../utils';
import { config } from '../../config';

const pubsub: PubSub = new PubSub();

const authorId1 = shortid.generate();
const authorId2 = shortid.generate();

const memorydb = {
  books: [
    { id: shortid.generate(), title: casual.title, authorId: authorId1 },
    { id: shortid.generate(), title: casual.title, authorId: authorId2 }
  ],
  users: [{ id: authorId1, name: casual.name }, { id: authorId2, name: casual.name }]
};

const CHANNEL = {
  BOOK: 'BOOK'
};

const SUBSCRIPTION = {
  BOOK: 'book'
};

const typeDefs: string = `
  type Book {
    id: ID!
    title: String!
    author: User!
  }

  type User {
    id: ID!
    name: String!
  }

  type Query {
    books: [Book]!
  }

  type Mutation {
    updateBook(id: ID!, title: String!): Book
  }

  type Subscription {
    ${SUBSCRIPTION.BOOK}: Book
  }
`;

const resolvers: IResolvers = {
  Book: {
    author: (root, _, context) => {
      // 对于mutation和query，context是graphqlExpress中的context
      // 对于subscription, context是onOperation函数中返回的context
      const { db } = context;
      return db.users.find((user: any) => user.id === root.authorId);
    }
  },
  Query: {
    books: (_, args, { db }) => db.books
  },
  Mutation: {
    updateBook: (_, { id, title }, { db }) => {
      const book = db.books.find((doc: any) => doc.id === id);
      if (book) {
        book.title = title;
        pubsub.publish(CHANNEL.BOOK, {
          [SUBSCRIPTION.BOOK]: book
        });
        return book;
      }
      return null;
    }
  },
  Subscription: {
    [SUBSCRIPTION.BOOK]: {
      resolve: (payload, args, context, info) => {
        return payload[SUBSCRIPTION.BOOK];
      },
      subscribe: withFilter(
        (rootValue, args, context, info) => {
          return pubsub.asyncIterator(CHANNEL.BOOK);
        },
        (payload, variables, context, info) => {
          logger.info('payload: ', payload);
          logger.info('variables: ', variables);
          return true;
        }
      )
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

function start() {
  const app = express();
  const subscriptionsEndpoint = `ws://localhost:${config.PORT}${config.WEBSOCKET_ROUTE}`;
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
          logger.info('connectionParams: ', connectionParams);

          // 这里返回的对象会被传入onOperation的params.context
          return {
            user: { name: 'test' }
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
              db: memorydb
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

  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress(req => {
      return {
        schema,
        context: {
          db: memorydb
        }
      };
    })
  );
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE, subscriptionsEndpoint }));
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start };
