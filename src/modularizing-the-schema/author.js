const Author = `
  type Author @cacheControl(maxAge: 60){
    id: ID!
    firstName: String
    lastName: String
    posts: [Post]
  }
`;

module.exports = Author;
