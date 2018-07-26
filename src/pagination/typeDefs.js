const typeDefs = `
  type Book {
    _id: ID!
    title: String!
    author: String!
  }

  type OffsetBasedPaginationResponse {
    datas: [Book!]!
    total: Int!
  }

  typed CursorBasedPaginationResponse {
    datas: [Book!]!
    cursor: String!
  }

  type Query {
    booksByOffset(offset: Int!, limit: Int = 10): OffsetBasedPaginationResponse
    booksByCursor(cursor: String!): CursorBasedPaginationResponse
  }
`;

exports.typeDefs = typeDefs;
