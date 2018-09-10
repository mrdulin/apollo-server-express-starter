interface IOptions {
  HOST: string;
  PORT: string | number;
  HTTPS_PORT: string | number;
  GRAPHQL_ROUTE: string;
  GRAPHIQL_ROUTE: string;
  GRAPHQL_ENDPOINT: string;
  WEBSOCKET_ROUTE: string;
  WEBSOCKET_ENDPOINT: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  MONGO_HOST: string;
  MONGO_PORT: string | number;
  MONGO_DB_NAME: string;
}

const config: IOptions = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 4000,
  HTTPS_PORT: process.env.HTTPS_PORT || 4001,
  GRAPHQL_ROUTE: '/graphql',
  GRAPHIQL_ROUTE: '/graphiql',
  GRAPHQL_ENDPOINT: '',
  WEBSOCKET_ROUTE: '/subscriptions',
  WEBSOCKET_ENDPOINT: '',
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: 6379,
  MONGO_HOST: process.env.MONGO_HOST || 'localhost',
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'apollo-server-express-starter'
};

config.GRAPHQL_ENDPOINT = `http://${config.HOST}:${config.PORT}${config.GRAPHQL_ROUTE}`;
config.WEBSOCKET_ENDPOINT = `ws://${config.HOST}:${config.PORT}${config.WEBSOCKET_ROUTE}`;

export { config };
