import { db } from '../db';

const Book = {
  findById(id: string) {
    const book = db.books.find(doc => doc.id === id);
    if (!book) {
      throw new Error('No book found');
    }
    return book;
  },

  findAll() {
    return db.books;
  }
};

export { Book };
