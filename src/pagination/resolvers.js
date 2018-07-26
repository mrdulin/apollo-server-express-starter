const resolvers = {
  Query: {
    async booksByOffset(_, { offset, limit }, ctx) {
      let datas = [];
      const start = offset * limit;
      const end = (offset + 1) * limit;

      const total = ctx.connectors.lowdb
        .get('books')
        .size()
        .value();

      if (start < total) {
        datas = ctx.connectors.lowdb
          .get('books')
          .slice(start, end)
          .take(limit)
          .value();
      }

      return {
        datas,
        total
      };
    }
  }
};

exports.resolvers = resolvers;
