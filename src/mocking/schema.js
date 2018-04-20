// const { makeExecutableSchema } = require('graphql-tools');

const schemaDefs = `
  type User {
    id: ID!
    name: String!
    paginatedFriends(pageNo: Int!): [User]
  }

  type Mutation{
    updateUserName(id: ID!, name: String!): User
  }

  type Query {
    allUsers: [User]
    user(id: ID!): User
  }
`;

// const schema = makeExecutableSchema({
//   typeDefs: [schemaDefs]
// });

exports.schemaDefs = schemaDefs;
