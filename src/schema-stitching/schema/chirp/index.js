const { makeExecutableSchema } = require('graphql-tools');

const { resolvers } = require('./resolvers');
const { schema: schemaDefs } = require('./schema');

const schema = makeExecutableSchema({
  typeDefs: [schemaDefs],
  resolvers
});

exports.schema = schema;
