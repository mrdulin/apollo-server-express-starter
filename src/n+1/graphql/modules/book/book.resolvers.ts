import { logger } from '../../../../utils';

const resolvers = {
  Query: {
    books: (_, args, { models }) => {
      return models.Book.getAll();
    }
  },
  Book: {
    author: (book, args, { models }) => {
      // logger.info(`resolver: Book.author; authorId: ${book.authorId}`);

      // 优化前
      // return models.User.getUserById(book.authorId);

      // 使用dataloader优化后
      return models.User.dataloaders.userById.load(book.authorId);
    }
  }
};

export default resolvers;
