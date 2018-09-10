import { mongooseConnect } from './database';
import { main } from './server';

if (process.env.NODE_ENV !== 'test') {
  mongooseConnect();
  main();
}

export { main, mongooseConnect };
