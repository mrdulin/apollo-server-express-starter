import { makeExecutableSchema } from 'graphql-tools';

import { schema as MessengerSchema } from './facebook/messenger/schema';
import { resolvers as MessengerResolvers } from './facebook/messenger/resolvers';

const Query = `
  type Query {
    sendMessage(recipient: RecipientInput, message: MessageInput): MessageResponse
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [MessengerSchema, Query],
  resolvers: MessengerResolvers
});

export { schema };
