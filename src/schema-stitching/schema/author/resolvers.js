const resolvers = {
  Query: {
    userById(root, args, ctx) {
      return { id: '1', email: 'novaline@qq.com' };
    }
  }
};

exports.resolvers = resolvers;
