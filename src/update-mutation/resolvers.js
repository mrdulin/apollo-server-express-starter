const shortid = require('shortid');

const resolvers = {
  Query: {
    books: (root, args, ctx) => {
      return ctx.lowdb.get('books').value();
    }
  },
  Mutation: {
    add: (root, { book }, ctx) => {
      const newBook = Object.assign({}, book, { id: shortid.generate() });
      return ctx.lowdb
        .get('books')
        .push(newBook)
        .last()
        .write();
    },
    update: (root, { book }, ctx) => {
      return ctx.lowdb
        .get('books')
        .find({ id: book.id })
        .assign(book)
        .write();
    }
  }
};

exports.resolvers = resolvers;
