const Author: string = `
  type Author {
    id: ID!
    firstName: String
    lastName: String
    posts: [Post]
  }
`;

export { Author };
