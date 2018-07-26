const typeDefs = `
  input BookInput {
    title: String!
    author: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
  }

  type Mutation{
    add(book: BookInput!): Book
    update(id: String!, book: BookInput!): Book
  }
`;

exports.typeDefs = typeDefs;
