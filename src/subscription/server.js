const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const shortid = require('shortid');

const pubsub = new PubSub();

const db = {
  comments: [{ id: shortid.generate(), content: 'angular' }, { id: shortid.generate(), content: 'react' }]
};

const COMMENT_ADD = 'COMMENT_ADD';

const SUBSCRIPTION = {
  ADD_COMMENT: 'addComment'
};

const typeDefs = `
  type Comment {
    id: String
    content: String
  }

  type Subscription {
    ${SUBSCRIPTION.ADD_COMMENT}: Comment
  }

  type Query {
    comments: [Comment]!
  }

  type Mutation {
    addComment(content: String!): Comment
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const resolvers = {
  Query: {
    comments: () => db.comments
  },
  Mutation: {
    addComment: (_, { content }) => {
      const comment = { id: shortid.generate(), content };
      db.comments.push(comment);
      pubsub.publish(COMMENT_ADD, { [SUBSCRIPTION.ADD_COMMENT]: comment });
      return comment;
    }
  },
  Subscription: {
    [SUBSCRIPTION.ADD_COMMENT]: {
      subscribe: () => pubsub.asyncIterator(COMMENT_ADD)
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

function start(done) {
  const app = express();
  const port = 3000;
  const wsPath = '/subscriptions';
  const subscriptionsEndpoint = `ws://localhost:${port}${wsPath}`;

  const server = http.createServer(app);

  server.listen(port, err => {
    if (err) {
      throw new Error(err);
    }
    console.log('Go to http://localhost:3000/graphiql to run queries!');

    const ss = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams, webSocket, context) => {
          console.log('onConnect');
          console.log('connectionParams: ', connectionParams);
          return connectionParams;
        },
        onOperation: (message, params, webSocket) => {
          console.log('onOperation');
          console.log('params: ', params);
          console.log('message: ', message);
          return message;
        },
        onOperationDone: webSocket => {
          console.log('onOperationDone');
        },
        onDisconnect: (webSocket, context) => {
          console.log('onDisconnect');
        }
      },
      {
        server,
        path: wsPath
      }
    );
  });

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, subscriptionsEndpoint }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql', subscriptionsEndpoint }));
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
