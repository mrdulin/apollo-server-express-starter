import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import cors from 'cors';
import http from 'http';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { logger, log } from '../utils';
import { config } from '../config';
import { DeprecatedDirective, UppercaseDirective, AuthDirective } from './directives';
import { db } from './db';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: { log },
  schemaDirectives: {
    deprecated: DeprecatedDirective,
    uppercase: UppercaseDirective,
    auth: AuthDirective
  }
});

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  app.use(cors());
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress((req: any) => {
      return {
        schema,
        context: {
          db,
          user: db.users[0]
        }
      };
    })
  );
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start, schema, resolvers };
