import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress, GraphQLOptions } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import cors from 'cors';
import http from 'http';

import { Book } from './database/models';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { config } from '../config';
import { logger } from '../utils';

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function main(): Promise<http.Server> {
  const app: express.Application = express();
  const graphqlOptions: GraphQLOptions = {
    schema,
    context: {
      models: {
        Book
      }
    }
  };
  app.use(cors());
  app.use(config.GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress(graphqlOptions));
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));
  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

export { main };
