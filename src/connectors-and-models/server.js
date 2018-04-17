const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const MessageTemplate = require('./facebook/messenger/models/MessageTemplate');
const MessengerConnector = require('./facebook/messenger/connector');

const schema = require('./schema');

const credential = require('./credential');

const app = express();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || credential.facebook.messenger.accessToken;

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
