import { IResolvers } from 'graphql-tools';
import { lowdb } from '../db';

const resolvers: IResolvers = {
  Query: {
    allUsers() {
      return lowdb.get('users').value();
    }
  }
};

export { resolvers };
