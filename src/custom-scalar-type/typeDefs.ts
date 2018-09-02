const typeDefs: string = `
  scalar Date

  type Book {
    id: ID!
    title: String
    author: String
    updatedAt: Date
  }

  type Query {
    books: [Book]
    booksByDate(min: Date, max: Date): [Book]
  }
`;

export { typeDefs };
