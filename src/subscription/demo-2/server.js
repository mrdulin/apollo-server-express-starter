const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const shortid = require('shortid');

const pubsub = new PubSub();

const db = {
  links: [
    { id: shortid.generate(), url: 'http://github.com', description: 'github' },
    { id: shortid.generate(), url: 'http://google.com', description: 'google' }
  ]
};

const CHANNEL = {
  LINK: 'LINK'
};

const SUBSCRIPTION = {
  LINK: 'link'
};

const typeDefs = `
  type Link {
    id: ID!
    description: String!
    url: String!
  }

  type LinkSubscriptionPayload {
    mutation: MutationType!
    node: Link
    updatedFields: [String!]
    previousValues: LinkPreviousValues
  }

  type LinkPreviousValues {
    id: ID!
    description: String!
    url: String!
  }

  enum MutationType {
    CREATED
    UPDATED
    DELETED
  }

  input LinkSubscriptionWhereInput {
    mutation_in: [MutationType!]
  }

  type Query {
    links: [Link]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
  }

  type Subscription {
    link(where: LinkSubscriptionWhereInput): LinkSubscriptionPayload
  }
`;

const resolvers = {
  Query: {
    links: () => db.links
  },
  Mutation: {
    createLink: (_, { url, description }) => {
      const link = { id: shortid.generate(), description, url };
      db.links.push(link);
      pubsub.publish(CHANNEL.LINK, { [SUBSCRIPTION.LINK]: link });
      return link;
    }
  },
  Subscription: {
    [SUBSCRIPTION.LINK]: {
      resolve: (payload, args, context, info) => {
        return payload.link;
      },
      subscribe: withFilter(
        (rootValue, args, context, info) => {
          return pubsub.asyncIterator(CHANNEL.LINK);
        },
        (payload, variables, context, info) => {
          console.log('payload: ', payload);
          console.log('variables: ', variables);
          return true;
        }
      )
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
