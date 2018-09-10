import mongoose from 'mongoose';

import { logger } from '../../utils';
import { config } from '../../config';

async function mongooseConnect(): Promise<mongoose.Mongoose | undefined> {
  const url: string = `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB_NAME}`;
  mongoose.connection
    .on('connecting', () => {
      logger.info('trying to establish a connection to mongo');
    })
    .on('disconnected', () => {
      logger.info('disconnect mongodb');
    })
    .on('connected', () => {
      logger.info('Connect mongodb successfully');
    })
    .on('error', () => {
      logger.error('Connect mongodb failed');
    });

  return mongoose.connect(
    url,
    { useNewUrlParser: true }
  );
}

export { mongooseConnect };
