const { makeExecutableSchema } = require('graphql-tools');

const { schema: MessengerSchema } = require('./facebook/messenger/schema');
const { resolvers: MessengerResolvers } = require('./facebook/messenger/resolvers');

const Query = `
  type Query {
    sendMessage(recipient: RecipientInput, message: MessageInput): MessageResponse
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [MessengerSchema, Query],
  resolvers: MessengerResolvers
});

module.exports = schema;
