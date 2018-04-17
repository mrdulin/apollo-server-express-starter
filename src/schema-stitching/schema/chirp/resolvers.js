const resolvers = {
  Query: {
    chirpById(root, args, ctx) {
      return { id: '1', text: 'graphql is awesome.', authorId: '1' };
    },
    chirpsByAuthorId(root, args, ctx) {
      return [
        { id: '1', text: 'graphql is awesome.', authorId: '1' },
        { id: '2', text: 'graphql-tools is awesome.', authorId: '2' }
      ];
    }
  }
};

exports.resolvers = resolvers;
