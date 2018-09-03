import { IResolvers } from 'graphql-tools';
import { GraphQLUpload } from 'apollo-upload-server';

const resolvers: IResolvers = {
  Upload: GraphQLUpload,
  Query: {
    uploads: (root, args, { Upload, db }) => {
      return Upload.getAll(db);
    }
  },
  Mutation: {
    singleUpload: (root, { file }, { Upload, db }) => {
      return Upload.singleUpload(file, db);
    },
    multipleUpload: async (root, { files }, { Upload, db }) => {
      return Upload.multipleUpload(files, db);
    }
  }
};

export { resolvers };
