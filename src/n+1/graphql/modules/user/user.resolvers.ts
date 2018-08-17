const resolvers = {
  Query: {
    user: (_, { id }, { models }) => {
      return models.User.getUserById(id);
    }
  }
};

export default resolvers;
