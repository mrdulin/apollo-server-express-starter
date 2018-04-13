const casual = require('casual');

const mocks = {
  Author: () => {
    return {
      firstName: () => casual.first_name,
      lastName: () => casual.last_name
    };
  },
  Post: () => {
    return {
      title: casual.title,
      content: casual.sentences(3)
    };
  },
  Query: () => {
    return {
      author: (root, { firstName, lastName }) => {
        return { firstName, lastName };
      }
    };
  }
};

module.exports = mocks;
