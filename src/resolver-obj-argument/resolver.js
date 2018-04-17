const fakeDb = {
  authors: [{ id: 1, name: 'lin' }, { id: 2, name: 'echo' }],
  posts: {
    1: [{ id: 1, authorId: 1, title: 'reactjs in action' }, { id: 3, authorId: 1, title: 'angular.js in action' }],
    2: [{ id: 2, authorId: 2, title: 'graphql.js in action' }]
  }
};

// graphql中内置的5种scalar类型，分别是：
// Int, Float, Boolean, String, ID。这里的name是String类型，不需要resolver

const resolvers = {
  Query: {
    getAuthor(root, args, ctx) {
      const authorFound = fakeDb.authors.find(author => author.id === args.id);
      return authorFound;
    }
  },
  // schema中的Author对象类型的解析器
  Author: {
    // schema中的Author对象类型的Posts字段（也是对象类型）解析器
    // resolver的函数签名是：fieldName(obj, args, context, info) { result }
    // obj包含从父域上的解析器返回的结果的对象, 本例就是getAuthor resolver返回的结果
    // https://www.apollographql.com/docs/graphql-tools/resolvers.html#Resolver-obj-argument
    posts: author => {
      console.log('author.posts: ', author);
      // 再通过当前author的id去查询这个author下的posts
      return fakeDb.posts[author.id];
    },
    // 为什么没有Author对象类型的name字段解析器？
    // 因为graphql使用了默认解析器，返回obj的相应的字段的值
    // https://www.apollographql.com/docs/graphql-tools/resolvers.html#Default-resolver
    // 等价于
    name: author => {
      console.log('author.name: ', author);
      return author.name;
    }
  },
  // schema中的Post对象类型的resolver，和Author同理
  Post: {
    // 由于Author下的posts是数组，所以该resolver会触发数组长度次数
    author: post => {
      console.log('Post.author: ', post);
      return fakeDb.authors.find(author => author.id === post.authorId);
    }
  }
};

module.exports = resolvers;
