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
    },

    async booksByCursor(_, { cursor: id, limit }, ctx) {
      let datas = [];
      let lastDataId = '';
      if (id) {
        const cursor = ctx.models.Book.find({ _id: { $gt: id } })
          .limit(limit)
          .cursor();
        try {
          for (let data = await cursor.next(); data != null; data = await cursor.next()) {
            datas.push(data);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          datas = await ctx.models.Book.find().limit(limit);
        } catch (error) {
          console.log(error);
        }
      }

      if (datas.length) {
        lastDataId = datas[datas.length - 1]._id.toString();
      }

      return {
        datas,
        cursor: lastDataId
      };
    },

    async booksByRelayStyleCursor(_, { first, after }, ctx) {
      if (typeof first === 'undefined') {
        throw new Error('You must provide a `first` or `last` value to properly paginate the `books` connection.');
      }

      let edges = [];
      let datas = [];
      const pageInfo = {};
      let total;

      try {
        total = await ctx.models.Book.countDocuments();
      } catch (error) {
        console.log(error);
      }

      if (after) {
        try {
          const cursor = await ctx.models.Book.find({ _id: { $gt: after } })
            .limit(first)
            .cursor();
          for (let data = await cursor.next(); data !== null; data = await cursor.next()) {
            datas.push(data);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          datas = await ctx.models.Book.find().limit(first);
        } catch (error) {
          console.log(error);
        }
      }

      edges = datas.map(data => {
        return { cursor: data._id.toString(), node: data };
      });

      const dataLen = datas.length;
      pageInfo.hasNextPage = total > first;
      pageInfo.endCursor = dataLen ? datas[dataLen - 1]._id.toString() : '';

      return {
        edges,
        pageInfo,
        total
      };
    }
  }
};

exports.resolvers = resolvers;
