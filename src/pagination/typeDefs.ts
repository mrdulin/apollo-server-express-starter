const typeDefs: string = `
  type Book {
    _id: ID!
    title: String!
    author: String!
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  type OffsetBasedPaginationResponse {
    docs: [Book!]!
    total: Int!
  }

  type CursorBasedPaginationResponse {
    docs: [Book!]!
    cursor: String!
  }

  type BookEdge{
    cursor: String!
    node: Book
  }

  type RelayCursorBasedPaginationResponse{
    edges: [BookEdge]
    pageInfo: PageInfo!
  }

  type Query {
    booksByOffset(offset: Int!, limit: Int = 10): OffsetBasedPaginationResponse
    booksByCursor(cursor: String, limit: Int = 10): CursorBasedPaginationResponse
    booksByRelayStyleCursor(before: String, after: String, first: Int, last: Int): RelayCursorBasedPaginationResponse
  }
`;

export { typeDefs };
