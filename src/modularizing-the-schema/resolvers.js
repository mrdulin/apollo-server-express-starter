const casual = require('casual');

const fakeAuthor = { id: casual.uuid, firstName: casual.first_name, lastName: casual.last_name };

const resolvers = {
  Query: {
    author(root, args) {
      return fakeAuthor;
    },
    allAuthors() {
      return [fakeAuthor];
    }
  },
  Author: {
    posts: author => {
      console.log(author);
      return [
        { id: casual.uuid, title: casual.title, content: casual.sentences(3), views: casual.integer(0, 10000) },
        { id: casual.uuid, title: casual.title, content: casual.sentences(3), views: casual.integer(0, 10000) }
      ];
    }
  },
  Post: {
    author(post) {
      return fakeAuthor;
    }
  }
};

module.exports = resolvers;
