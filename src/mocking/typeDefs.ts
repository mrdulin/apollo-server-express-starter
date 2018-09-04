const typeDefs: string = `
  type User {
    id: ID!
    name: String!
    friends: [User]!
  }

  type Mutation{
    updateUserName(id: ID!, name: String!): User
  }

  type Query {
    allUsers: [User]!
    user(id: ID!, limit: Int, offset: Int): User
  }
`;

export { typeDefs };
