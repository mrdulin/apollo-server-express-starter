const typeDefs: string = `
  enum Status {
    SOLD_OUT
    NO_STOCK
    OUT_OF_DATE @deprecated(reason: "This value is deprecated")
  }

  type Book {
    id: ID!
    title: String @uppercase
    author: String
    status: Status
    name: String @deprecated(reason: "Use title instead")
  }

  type Query {
    books: [Book]!
    bookByStatus(status: Status!): [Book]!
  }
`;

export { typeDefs };
