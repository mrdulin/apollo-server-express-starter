const typeDefs: string = `
  scalar Date
  scalar JSON


  type Website {
    url: String
    description: String
  }

  type Book {
    id: ID!
    title: String
    author: String
    updatedAt: Date

    # compare these two fields
    websites: JSON
    websitesV2: [Website]!
  }

  type Query {
    books: [Book]
    booksByDate(min: Date, max: Date): [Book]
  }
`;

export { typeDefs };
