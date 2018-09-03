import { IResolvers } from 'graphql-tools';
import { IAuthorModel, IPost } from './db';

const resolvers: IResolvers = {
  Query: {
    author(root, { id }, { db }) {
      return db
        .get('authors')
        .find({ id })
        .value();
    },
    allAuthors(root, args, { db }) {
      return db.get('authors').value();
    },
    getFortuneCookie(root, args, { FortuneCookie }) {
      // resolver可以在返回一个值，也可以返回一个promise
      return FortuneCookie.getOne();
    }
  },
  Author: {
    posts: (author: IAuthorModel, args, { db }): IPost[] => {
      return db
        .get('posts')
        .value()
        .filter((post: IPost) => author.postIds.includes(post.id));
    }
  },
  Post: {
    author(post, args, { db }) {
      return db
        .get('authors')
        .value()
        .filter((author: IAuthorModel) => author.postIds.includes(post.id));
    }
  }
};

export { resolvers };
