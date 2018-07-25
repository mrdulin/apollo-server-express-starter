const typeDefs = `
  scalar Upload

  type File {
    id: ID!
    filename: String
  }

  type Query {
    uploads: [File!]!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    mutipleUpload(files: [Upload!]!): [File!]!
  }
`;

exports.typeDefs = typeDefs;
