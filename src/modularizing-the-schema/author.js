const Author = `
  type Author {
    id: ID!
    firstName: String
    lastName: String
    posts: [Post]
  }
`;

module.exports = Author;
