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
    multipleUpload(text: String, files: [Upload!]!): [File!]!
  }
`;

exports.typeDefs = typeDefs;
