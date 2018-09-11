import { IResolvers } from 'graphql-tools';
import { IBook } from './db';

const resolvers1: IResolvers = {
  Query: {
    books: (_, args, { db }): Promise<IBook[]> => {
      return db.books.map(book => {
        book.author = db.users.find(user => book.authorId === user.id);
        return book;
      });
    }
  }
};

const resolvers2: IResolvers = {
  Query: {
    books: (_, args, { db }): Promise<IBook[]> => {
      return db.books;
    }
  },
  Book: {
    author: (book, args, { db }) => {
      return db.users.find(user => book.authorId === user.id);
    }
  }
};

export { resolvers1, resolvers2 };
