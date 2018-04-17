const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolver');

const typeDefs = `
  type Query { 
    getAuthor(id: Int!): Author
  }
  
  type Post {
    title: String
    author: Author
  }

  type Author {
    name: String
    posts: [Post]
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
