const typeDefs: string = `
  type Book {
    id: ID!
    title: String
    authorId: ID!
    author: User
  }

  type User {
    id: ID!
    name: String
  }

  type Query {
    books: [Book]!
  }
`;

export { typeDefs };
