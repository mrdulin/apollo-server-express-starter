const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolver');

const typeDefs = `
  interface Node {
    id: ID!
  }
  type Query { 
    getAuthor(id: Int!): Author
  }
  
  type Post implements Node {
    id: ID!
    title: String
    author: Author
  }

  type Author implements Node {
    id: ID!
    name: String
    posts: [Post]
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
