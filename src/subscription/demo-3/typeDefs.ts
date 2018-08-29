import { SUBSCRIPTION } from './channel';

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

export { typeDefs };
