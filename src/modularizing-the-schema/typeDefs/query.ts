const Query = `
  type Query {
    author(id: ID!): Author
    allAuthors: [Author]
    getFortuneCookie: String # this is comment
  }
`;

export { Query };
