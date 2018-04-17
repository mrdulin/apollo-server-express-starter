const { mergeSchemas, addMockFunctionsToSchema } = require('graphql-tools');

const { schema: authorSchema } = require('./author');
const { schema: chirpSchema } = require('./chirp');

const linkTypeDefs = `
  extend type User {
    chirps: [Chirp]
  }

  extend type Chirp {
    author: User
  }
`;

const schema = mergeSchemas({
  schemas: [authorSchema, chirpSchema, linkTypeDefs],
  resolvers: mergeInfo => {
    return {
      User: {
        chirps: {
          fragment: 'fragment UserFragment on User { id }',
          resolve(parent, args, context, info) {
            const authorId = parent.id;
            return mergeInfo.delegate(
              'query',
              'chirpsByAuthorId',
              {
                authorId
              },
              context,
              info
            );
          }
        }
      },

      Chirp: {
        author: {
          fragment: 'fragment ChirpFragment on Chirp { authorId }',
          resolve(parent, args, context, info) {
            const id = parent.authorId;
            return mergeInfo.delegate(
              'query',
              'userById',
              {
                id
              },
              context,
              info
            );
          }
        }
      }
    };
  }
});

module.exports = schema;
