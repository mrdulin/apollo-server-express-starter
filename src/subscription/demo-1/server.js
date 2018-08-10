const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const shortid = require('shortid');
const casual = require('casual');
const cors = require('cors');

const pubsub = new PubSub();

const orgId = shortid.generate();
const locationId1 = shortid.generate();
const locationId2 = shortid.generate();

const db = {
  locations: [{ id: locationId1, orgId, name: casual.address2 }, { id: locationId2, orgId, name: casual.address2 }],
  users: [
    {
      id: shortid.generate(),
      name: casual.name,
      email: casual.email,
      orgId: null,
      locationId: locationId1,
      userType: 'ZELO'
    },
    { id: shortid.generate(), name: casual.name, email: casual.email, orgId, locationId: null, userType: 'ZEWI' },
    { id: shortid.generate(), name: casual.name, email: casual.email, orgId, locationId: null, userType: 'ZOWI' }
  ],
  comments: [
    { id: shortid.generate(), content: casual.short_description, shareLocationIds: [locationId1] },
    { id: shortid.generate(), content: casual.short_description, shareLocationIds: [locationId2] }
  ]
};

const findLocationsByOrgId = id => db.locations.map(location => location.orgId === id);
const findUserByUserType = type => db.users.find(user => user.userType === type);
const findLocationIdsByOrgId = id => findLocationsByOrgId(id).map(loc => loc.id);

const intersection = (arr1, arr2) => arr1.filter(value => arr2.indexOf(value) !== -1);

function toJson(obj) {
  if (typeof obj === 'string') {
    return obj;
  }
  try {
    return JSON.stringify(obj, null, 4);
  } catch (error) {
    throw new Error(error);
  }
}

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
    deleteAllComment: Int
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
    addComment: (_, { content }, ctx) => {
      const comment = { id: shortid.generate(), content: casual.short_description, shareLocationIds: [locationId1] };
      const reqUser = findUserByUserType(ctx.user.userType);

      db.comments.push(comment);
      pubsub.publish(CHANNEL.COMMENT_ADD, {
        [SUBSCRIPTION.ADD_COMMENT]: {
          comment,
          user: reqUser
        }
      });
      return comment;
    },
    deleteAllComment: () => {
      const count = db.comments.length;
      db.comments = [];
      return count;
    }
  },
  Subscription: {
    [SUBSCRIPTION.ADD_COMMENT]: {
      resolve: (payload, args, context) => {
        return payload[SUBSCRIPTION.ADD_COMMENT].comment;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHANNEL.COMMENT_ADD]),
        (payload, variables, context) => {
          if (!payload) {
            return false;
          }
          const { user: subscribeUser } = context;
          const {
            addComment: { user: sendUser, comment }
          } = payload;

          console.log('subscribeUser.userType: ', subscribeUser.userType);
          console.log('sendUser.userType: ', sendUser.userType);

          // send message user: ZOWI
          // subscribe users: ZELO-1, ZELO-2, ZEWI-1(ZELO-3, ZELO-4), ZEWI-2(ZELO-5, ZELO-6)
          // ZOWI send message => ZELO-1, ZELO-2, ZEWI-1(ZELO-3, ZELO-4), ZEWI-2(ZELO-5, ZELO-6) receive message

          const notifyLocationIds = comment.shareLocationIds;
          let subscribeLocationIds = [];

          switch (subscribeUser.userType) {
            case 'ZELO':
              subscribeLocationIds = [subscribeUser.locationId];
              break;
            case 'ZEWI':
              subscribeLocationIds = findLocationIdsByOrgId(subscribeUser.orgId);
              break;
            case 'ZOWI':
              return false;
            default:
              break;
          }

          // notifyLocationIds = [1,2,3], subscribeLocationIds = [1,4]

          const shouldNofity = intersection(notifyLocationIds, subscribeLocationIds).length > 0;
          return shouldNofity;
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
          console.log(`onConnect - connectionParams: ${toJson(connectionParams)}`);

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
          console.log(`onOperation - params: ${toJson(params)}, message: ${toJson(message)}`);
          return params;
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
        //   console.log('req.headers.authorization: ', req.headers.authorization);
        //   if (req.headers.authorization) {
        //     const parts = req.headers.authorization.split(' ');
        //     const token = parts[1];
        //     return cb(true);
        //   }
        //   return cb(true);
        // }
      }
    );
  });

  app.use(cors(), auth);
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => {
      return {
        schema,
        context: {
          user: req.user
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

module.exports = start;
