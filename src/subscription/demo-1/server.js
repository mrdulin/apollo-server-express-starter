const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const shortid = require('shortid');
const cors = require('cors');

const pubsub = new PubSub();

const db = {
  users: [{ id: shortid.generate(), name: 'mrdulin', email: 'novaline@qq.com' }],
  comments: [{ id: shortid.generate(), content: 'angular' }, { id: shortid.generate(), content: 'react' }]
};

const CHANNEL = {
  COMMENT_ADD: 'COMMENT_ADD'
};

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
      pubsub.publish(CHANNEL.COMMENT_ADD, { [SUBSCRIPTION.ADD_COMMENT]: comment });
      return comment;
    }
  },
  Subscription: {
    [SUBSCRIPTION.ADD_COMMENT]: {
      // resolve: (payload, args, context, info) => {
      //   return payload[SUBSCRIPTION.ADD_COMMENT];
      // },
      subscribe: () => pubsub.asyncIterator(CHANNEL.COMMENT_ADD)
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

function start(done) {
  const app = express();
  const port = 4000;
  const wsPath = '/subscriptions';
  const subscriptionsEndpoint = `ws://localhost:${port}${wsPath}`;

  const server = http.createServer(app);

  server.listen(port, err => {
    if (err) {
      throw new Error(err);
    }
    console.log(`Go to http://localhost:${port}/graphiql to run queries!`);

    const ss = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams, webSocket, context) => {
          console.log(`onConnect - connectionParams: ${connectionParams}`);

          const { token } = connectionParams;
          const parts = token.split(' ');
          const bearer = parts[0];
          const credential = parts[1];
          if (/^Bearer$/i.test(bearer) && credential) {
            const currentUser = db.users.find(user => user.name === 'mrdulin');
            return {
              user: currentUser
            };
          }

          throw new Error('Missing auth token!');
        },
        onOperation: (message, params, webSocket) => {
          console.log(`onOperation - params: ${params}, message: ${message}`);
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
        // verifyClient: (info, cb) => {
        //   const { req, origin } = info;
        //   if (req.headers.Authorization) {
        //     const parts = req.headers.Authorization.split(' ');
        //     const token = parts[1];
        //     return cb(true);
        //   }
        //   return cb(false);
        // }
      }
    );
  });

  app.use(cors());
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, subscriptionsEndpoint }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql', subscriptionsEndpoint }));
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
