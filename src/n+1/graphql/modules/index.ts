import path from 'path';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';

const resolversArray = fileLoader(path.join(__dirname, './**/*.resolvers.*'));
const typesArray = fileLoader(path.join(__dirname, './**/*.graphql'));

const resolvers = mergeResolvers(resolversArray);
const typeDefs = mergeTypes(typesArray);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema, resolvers };
