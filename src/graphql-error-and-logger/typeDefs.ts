const typeDefs: string = `
  type Query {
    books: [Book]!
    bookById(id: ID!): Book
  }

  type Book {
    id: ID!
    title: String
    author: String
  }
`;

export { typeDefs };
