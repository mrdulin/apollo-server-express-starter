import { SUBSCRIPTION } from './channel';

const typeDefs: string = `
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

export { typeDefs };
