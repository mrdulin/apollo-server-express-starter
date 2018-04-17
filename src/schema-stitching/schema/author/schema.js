exports.schema = `
  type User {
    id: ID!
    email: String
  }

  type Query {
    userById(id: ID!): User
  }
`;
