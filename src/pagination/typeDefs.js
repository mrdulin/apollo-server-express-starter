const typeDefs = `
  type Book {
    _id: ID!
    title: String!
    author: String!
  }

  interface Pagination{
    startCursor
    endCursor
    hasNextPage
  }

  type OffsetBasedPaginationResponse {
    datas: [Book!]!
    total: Int!
  }

  type CursorBasedPaginationResponse {
    datas: [Book!]!
    cursor: String!
  }

  type

  type Query {
    booksByOffset(offset: Int!, limit: Int = 10): OffsetBasedPaginationResponse
    booksByCursor(cursor: String, limit: Int = 10): CursorBasedPaginationResponse
    booksByRelayStyleCursor():
  }
`;

exports.typeDefs = typeDefs;
