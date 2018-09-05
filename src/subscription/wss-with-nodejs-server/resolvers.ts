import { IResolvers } from 'graphql-tools';
import { PubSub, withFilter } from 'graphql-subscriptions';
import shortid from 'shortid';

const pubsub: PubSub = new PubSub();
const CHANNEL = {
  LINK: 'LINK'
};

const resolvers: IResolvers = {
  Query: {
    links: (_, args, { db }) => db.links
  },
  Mutation: {
    createLink: (_, { url, description }, { db }) => {
      const link = { id: shortid.generate(), description, url };
      db.links.push(link);
      pubsub.publish(CHANNEL.LINK, { data: link });
      return link;
    }
  },
  Subscription: {
    link: {
      resolve: payload => {
        if (payload.data) {
          return payload.data;
        }
        return payload;
      },
      subscribe: withFilter(
        (rootValue, args, context) => {
          return pubsub.asyncIterator(CHANNEL.LINK);
        },
        (payload, variables, context) => {
          return true;
        }
      )
    }
  }
};

export { resolvers };
