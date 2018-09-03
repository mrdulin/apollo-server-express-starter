import shortid from 'shortid';
import { IResolvers } from 'graphql-tools';
import { IBook } from './db';

const resolvers: IResolvers = {
  Query: {
    books: (root, args, ctx): IBook => {
      return ctx.lowdb.get('books').value();
    }
  },
  Mutation: {
    add: (root, { book }, ctx): IBook => {
      const newBook: IBook = Object.assign({}, book, { id: shortid.generate() });
      return ctx.lowdb
        .get('books')
        .push(newBook)
        .last()
        .write();
    },
    update: (root, { book }, ctx): IBook => {
      return ctx.lowdb
        .get('books')
        .find({ id: book.id })
        .assign(book)
        .write();
    }
  }
};

export { resolvers };
