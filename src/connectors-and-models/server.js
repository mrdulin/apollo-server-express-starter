const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const MessageTemplate = require('./facebook/messenger/models/MessageTemplate');
const MessengerConnector = require('./facebook/messenger/connector');

const schema = require('./schema');

const app = express();
const ACCESS_TOKEN =
  process.env.ACCESS_TOKEN ||
  'DQVJ1YjV1M0d2b3VGalE2eF9QbDVnM094N3cwYnc1ZAk1DWEFhc2FHREZACeGlTZAloxSXRvdUlWU3BtZADZACc0hYNmxKbXo1ZATBpVjdISkNmSkFsZAllxVGhRckZABVlBGc2t3VklURzd2cnJpOE40cjR4T1hQaFI5ZAU03a3BkUmFSbnpUaE9oWXVvNlplSWxDSFpWNVdHVkR5YUlHSkY3UjN6bkZADQVhkTWoxdW1fWllzR19GRVlCdUNpSEwtT25RQ2pDc1NzT2RkSDJGVTJuV2ZAIbQZDZD';

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    const messengerConnector = new MessengerConnector({
      accessToken: ACCESS_TOKEN
    });

    return {
      schema,
      tracing: true,
      context: {
        MessageTemplate: new MessageTemplate({ connector: messengerConnector })
      }
    };
  })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
