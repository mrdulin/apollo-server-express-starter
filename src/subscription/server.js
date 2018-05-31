const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const books = [
  {
    id: '1',
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  },
  {
    id: '2',
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

const typeDefs = `
  type Comment {
    id: String
    content: String
  }

  type Subscription {
    commentAdded(repoFullName: String!): Comment
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const resolvers = {
  Subscription: {
    commentAdded: {
      resolve: payload => {
        return {
          customData: payload
        };
      },
      subscribe: () => pubsub.asyncIterator('commentAdded')
    }
  }
};

const payload = {
  commentAdded: {
    id: '1',
    content: 'Hello!'
  }
};

pubsub.publish('commentAdded', payload);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

function start(done) {
  const app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  return app.listen(3000, () => {
    if (done) done();
    console.log('Go to http://localhost:3000/graphiql to run queries!');
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
