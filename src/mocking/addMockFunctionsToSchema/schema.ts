import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import { typeDefs } from '../typeDefs';
import { resolvers } from './resolvers';

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
