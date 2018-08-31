const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');
const { printSchema, parse } = require('graphql');
const { ApolloLink } = require('apollo-link');
const { mergeTypes } = require('merge-graphql-schemas');

async function getRemoteExecutableSchema(links) {
  const graphqlSchemas = await Promise.all(links.map(introspectSchema));
  // const schema = await introspectSchema(link);

  // convert GraphqlSchema object to schema string;
  // console.log('printSchema: ', printSchema(schema));
  const typeArray = graphqlSchemas.map(printSchema);

  const schema = mergeTypes(typeArray, { all: true });

  try {
    parse(schema);
  } catch (err) {
    console.log(err);
  }

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    // https://www.apollographql.com/docs/link/composition.html#directional
    link: ApolloLink.split(
      operation => {
        return operation.getContext().graphqlContext.req.headers['link-remote'] === 'githunt';
      },
      links[0],
      links[1]
    )
  });

  return executableSchema;
}

module.exports = { getRemoteExecutableSchema };
