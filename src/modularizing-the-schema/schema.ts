import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import { resolvers } from './resolvers';
import { Post, Author, Query } from './typeDefs';

const SchemaDef: string = `
  schema {
    query: Query
  }
`;

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [SchemaDef, Query, Post, Author],
  resolvers
});

export { schema };
