import { withFilter } from 'graphql-subscriptions';
import { IResolvers } from 'graphql-tools';

import { CHANNEL, SUBSCRIPTION } from './channel';
import { logger } from '../../utils';
import { pubsub } from './pubsub';

const resolvers: IResolvers = {
  Book: {
    author: (root, _, context) => {
      // 对于mutation和query，context是graphqlExpress中的context
      // 对于subscription, context是onOperation函数中返回的context
      const { db } = context;
      return db
        .get('users')
        .find({ id: root.authorId })
        .value();
    }
  },
  Query: {
    books: (_, args, { db }) => db.get('books').value()
  },
  Mutation: {
    updateBook: (_, { id, title }, { db }) => {
      const book = db
        .get('books')
        .find({ id })
        .assign({ title })
        .value();

      if (book) {
        pubsub.publish(CHANNEL.BOOK, {
          [SUBSCRIPTION.BOOK]: book
        });
        return book;
      }
      return null;
    }
  },
  Subscription: {
    [SUBSCRIPTION.BOOK]: {
      resolve: (payload, args, context, info) => {
        return payload[SUBSCRIPTION.BOOK];
      },
      subscribe: withFilter(
        (rootValue, args, context, info) => {
          return pubsub.asyncIterator(CHANNEL.BOOK);
        },
        (payload, variables, context, info) => {
          logger.info('payload: ', payload);
          logger.info('variables: ', variables);
          return true;
        }
      )
    }
  }
};

export { resolvers };
