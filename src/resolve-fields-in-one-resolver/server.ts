import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLOptions } from 'apollo-server-core';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import cors from 'cors';
import http from 'http';

import { logger } from '../utils';
import { config } from '../config';
import { resolvers1, resolvers2 } from './resolvers';
import { typeDefs } from './typeDefs';
import { db } from './db';

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers: resolvers1 });

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  const graphqlOptions: GraphQLOptions = {
    schema,
    context: { db }
  };
  app.use(cors());
  app.use(config.GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress(graphqlOptions));
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start, schema };
