exports.schema = `
  type Chirp {
    id: ID!
    text: String
    authorId: ID!
  }

  type Query {
    chirpById(id: ID!): Chirp
    chirpsByAuthorId(id: ID!): [Chirp]
  }
`;
