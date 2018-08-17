import { logger } from '../../../../utils';

const resolvers = {
  Query: {
    books: (_, args, { models }) => {
      return models.Book.getAll();
    }
  },
  Book: {
    author: (book, { dataloaders }) => {
      logger.info('resolver: Book.author');

      // 优化前
      // return getUserById(book.authorId);

      // 使用dataloader优化后
      return dataloaders.userById.load(book.authorId);
    }
  }
};

export default resolvers;
