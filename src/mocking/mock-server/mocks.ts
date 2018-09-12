import { IMocks } from 'graphql-tools';

import { lowdb as db } from '../db';
import { logger } from '../../utils';

const mocks: IMocks = {
  friends: parent => {
    return db
      .get('users')
      .value()
      .filter(user => user.friends.includes(parent.id));
  },
  Query: () => {
    return {
      allUsers: () => {
        return db.get('users').value();
      },
      user: (source, { id }) => {
        return db
          .get('users')
          .find({ id })
          .value();
      }
    };
  },
  Mutation: () => {
    return {
      updateUserName: (source, { id, name }) => {
        return db
          .get('users')
          .find({ id })
          .assign({ name })
          .write();
      }
    };
  }
};

export { mocks };
