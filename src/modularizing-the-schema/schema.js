const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');

// const mocks = require('./mocks');

const resolvers = require('./resolvers');

const Post = require('./post');
const Author = require('./author');

const Query = `
  type Query {
    author(firstName: String, lastName: String): Author
    allAuthors: [Author]
    getFortuneCookie: String # this is comment
  }
`;

const SchemaDef = `
  schema {
    query: Query
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [SchemaDef, Query, Post, Author],
  resolvers
});

// addMockFunctionsToSchema({ schema, mocks });

module.exports = schema;
