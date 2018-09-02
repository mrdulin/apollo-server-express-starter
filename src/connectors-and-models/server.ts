import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import { MessageTemplate } from './facebook/messenger/models/MessageTemplate';
import { MessengerConnector } from './facebook/messenger/connector';
import { schema } from './schema';
import { logger } from '../utils';
import { config } from '../config';

const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || '';

const app: express.Application = express();
app.use(
  config.GRAPHQL_ROUTE,
  bodyParser.json(),
  graphqlExpress(req => {
    const messengerConnector = new MessengerConnector({ accessToken: ACCESS_TOKEN });

    return {
      schema,
      tracing: true,
      context: {
        MessageTemplate: new MessageTemplate({ connector: messengerConnector })
      }
    };
  })
);
app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));
app.listen(config.PORT, () => {
  logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
});
