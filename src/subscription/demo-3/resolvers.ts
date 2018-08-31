import { withFilter } from 'graphql-subscriptions';
import { IResolvers } from 'graphql-tools';

import { CHANNEL, SUBSCRIPTION } from './channel';
import { logger } from '../../utils';
import { pubsub } from './pubsubs/google';

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
    updateBook: (_, { id, title }, { db, user }) => {
      const book = db
        .get('books')
        .find({ id })
        .assign({ title })
        .value();

      if (book) {
        pubsub.publish(CHANNEL.CAMPAIGN_TEMPLATE, {
          data: book,
          context: {
            user
          }
        });
        return book;
      }
    }
  },
  Subscription: {
    [SUBSCRIPTION.BOOK]: {
      // if not handle google pub/sub message within commonMessageHandler
      // resolve: (message, args, context) => {
      //   const payload = JSON.parse(message.data.toString());
      //   return payload.data;
      // },

      resolve: (payload, args, context) => {
        return payload.data;
      },
      subscribe: withFilter(
        (rootValue, args, context) => {
          return pubsub.asyncIterator(CHANNEL.CAMPAIGN_TEMPLATE);
        },
        (payload, variables, context) => {
          logger.info({ label: 'payload', msg: payload });
          logger.info({ label: 'variables', msg: variables });

          const { db } = context;
          const subscribeUser = db
            .get('users')
            .find({ id: context.user.id })
            .value();

          const requestingUser = db
            .get('users')
            .find({ id: payload.context.user.id })
            .value();
          logger.info({ label: 'subscribeUser', msg: subscribeUser });
          logger.info({ label: 'requestingUser', msg: requestingUser });
          return true;
        }
      )
    }
  }
};

export { resolvers };
