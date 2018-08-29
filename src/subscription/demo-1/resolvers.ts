import shortid from 'shortid';
import casual from 'casual';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { IResolvers } from 'graphql-tools';

import { logger, intersection } from '../../utils';
import { findLocationIdsByOrgId, findUserByUserType, locationId1, db } from './db';
import { CHANNEL, SUBSCRIPTION } from './channel';

const pubsub: PubSub = new PubSub();

const resolvers: IResolvers = {
  Query: {
    comments: () => db.comments
  },
  Mutation: {
    addComment: (_, { content }, ctx) => {
      const comment = { id: shortid.generate(), content: casual.short_description, shareLocationIds: [locationId1] };
      const reqUser = findUserByUserType(ctx.user.userType);

      db.comments.push(comment);
      pubsub.publish(CHANNEL.COMMENT_ADD, {
        [SUBSCRIPTION.ADD_COMMENT]: {
          comment,
          user: reqUser
        }
      });
      return comment;
    },
    deleteAllComment: () => {
      const count = db.comments.length;
      db.comments = [];
      return count;
    }
  },
  Subscription: {
    [SUBSCRIPTION.ADD_COMMENT]: {
      resolve: (payload, args, context) => {
        if (payload && payload[SUBSCRIPTION.ADD_COMMENT]) {
          return payload[SUBSCRIPTION.ADD_COMMENT].comment;
        }
        return payload;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHANNEL.COMMENT_ADD]),
        (payload, variables, context): boolean => {
          if (!payload) {
            return false;
          }
          const { user: subscribeUser } = context;
          const {
            addComment: { user: sendUser, comment }
          } = payload;

          logger.info('subscribeUser.userType: ', subscribeUser.userType);
          logger.info('sendUser.userType: ', sendUser.userType);

          // send message user: ZOWI
          // subscribe users: ZELO-1, ZELO-2, ZEWI-1(ZELO-3, ZELO-4), ZEWI-2(ZELO-5, ZELO-6)
          // ZOWI send message => ZELO-1, ZELO-2, ZEWI-1(ZELO-3, ZELO-4), ZEWI-2(ZELO-5, ZELO-6) receive message

          const notifyLocationIds: string[] = comment.shareLocationIds;
          let subscribeLocationIds: string[] = [];

          switch (subscribeUser.userType) {
            case 'ZELO':
              subscribeLocationIds = [subscribeUser.locationId];
              break;
            case 'ZEWI':
              subscribeLocationIds = findLocationIdsByOrgId(subscribeUser.orgId);
              break;
            case 'ZOLO':
              subscribeLocationIds = [subscribeUser.locationId];
              break;
            case 'ZOWI':
              return true;
            default:
              break;
          }

          // notifyLocationIds = [1,2,3], subscribeLocationIds = [1,4]

          const shouldNofity: boolean = intersection(notifyLocationIds, subscribeLocationIds).length > 0;
          return shouldNofity;
        }
      )
    }
  }
};

export { resolvers };
