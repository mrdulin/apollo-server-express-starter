import { IResolvers } from 'graphql-tools';
import { logger } from '../utils';

const resolvers: IResolvers = {
  Query: {
    async booksByOffset(_, { offset, limit }, { models }) {
      return models.Book.booksByOffset(offset, limit);
    },

    async booksByCursor(_, { cursor, limit }, { models }) {
      return models.Book.booksByCursor(limit, cursor);
    },

    async booksByRelayStyleCursor(_, { before, after, first, last }, { models }) {
      return models.Book.booksByRelayStyleCursor({ before, after, first, last });
    }
  }
};

export { resolvers };
