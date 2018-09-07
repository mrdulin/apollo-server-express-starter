import { IResolvers } from 'graphql-tools';
import { IBook } from './db';

const resolvers: IResolvers = {
  Query: {
    books: (_, args, { db }): Promise<IBook[]> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(db.books);
        }, 2000);
      });
    },
    bookByStatus: (_, { status }, { db }) => {
      return db.books.filter(book => book.status === status);
    },
    user: (_, { id }, { db }) => {
      return db.users.find(user => user.id === id);
    }
  }
};
export { resolvers };
