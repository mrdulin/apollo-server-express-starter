const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const cors = require('cors');

const { getRemoteExecutableSchema } = require('./helper');

async function main(options) {
  const schema = await getRemoteExecutableSchema(options.links);
  const app = express();

  app.use(cors());
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => {
      return {
        schema,
        context: {
          req
        }
      };
    })
  );
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return app.listen(options.port, () => {
    console.log(`Go to http://localhost:${options.port}/graphiql to run queries!`);
  });
}

module.exports = {
  main
};
