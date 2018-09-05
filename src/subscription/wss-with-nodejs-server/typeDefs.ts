const typeDefs: string = `
  type Link {
    id: ID!
    description: String!
    url: String!
  }

  type Query {
    links: [Link]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
  }

  type Subscription {
    link: Link
  }
`;

export { typeDefs };
