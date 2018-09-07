import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import http from 'http';
import { GraphQLOptions } from 'apollo-server-core';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { config } from '../config';
import { logger } from '../utils';
import { Book } from './models';

function log(err: any) {
  let msg: string;
  if (err instanceof Error) {
    msg = err.message;
  } else {
    msg = err;
  }
  logger.error(msg);
}

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers, logger: { log } });

async function main(): Promise<http.Server> {
  const app: express.Application = express();
  const graphqlOptions: GraphQLOptions = {
    schema,
    context: {
      Book
    },
    formatError: err => {
      logger.info('formatError');
      const logErr = {
        path: err.path,
        locations: err.locations
      };
      // tslint:disable-next-line:no-console
      console.error(logErr);
      return err;
    }
  };
  app.use(config.GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress(graphqlOptions));
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));
  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  main();
}

export { main, schema, resolvers };
