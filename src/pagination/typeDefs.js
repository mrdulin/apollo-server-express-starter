const typeDefs = `
  type Book {
    _id: ID!
    title: String!
    author: String!
  }

  type PageInfo{
    startCursor: String
    endCursor: String
    hasPrevPage: Boolean!
    hasNextPage: Boolean!
  }

  type OffsetBasedPaginationResponse {
    datas: [Book!]!
    total: Int!
  }

  type CursorBasedPaginationResponse {
    datas: [Book!]!
    cursor: String!
  }

  type BookEdge{
    cursor: String!
    node: Book
  }

  type RelayCursorBasedPaginationResponse{
    edges: [BookEdge]
    pageInfo: PageInfo!
    total: Int!
  }

  type Query {
    booksByOffset(offset: Int!, limit: Int = 10): OffsetBasedPaginationResponse
    booksByCursor(cursor: String, limit: Int = 10): CursorBasedPaginationResponse
    booksByRelayStyleCursor(first: Int, after: String): RelayCursorBasedPaginationResponse
  }
`;

exports.typeDefs = typeDefs;
