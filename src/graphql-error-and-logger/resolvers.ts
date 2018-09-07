import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: {
    books: (_, args, { Book }) => Book.findAll(),
    bookById: (_, { id }, { Book }) => {
      return Book.findById(id);
    }
  }
};

export { resolvers };
