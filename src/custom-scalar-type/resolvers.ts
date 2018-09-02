import { IResolvers } from 'graphql-tools';
import { GraphQLScalarType, Kind } from 'graphql';
import { logger } from '../utils';

const resolvers: IResolvers = {
  Query: {
    books: (root, args, { db }) => db.get('books').value(),
    booksByDate: (root, { min, max }, { db }) => {
      logger.info(`min: ${min}, max: ${max}`);
      return db
        .get('books')
        .value()
        .filter(book => {
          const updatedAt: number = new Date(book.updatedAt).getTime();
          if (min && max) {
            return min < updatedAt < max;
          } else if (min) {
            return min < updatedAt;
          } else if (max) {
            return updatedAt < max;
          }
          return true;
        });
    }
  },
  // 方式一：
  // Date: new GraphQLScalarType({
  //   name: 'Date',
  //   description: 'Date custom scalar type',
  //   // gets invoked to parse client input that was passed through variables
  //   parseValue(value) {
  //     return new Date(value);
  //   },
  //   // gets invoked when serializing the result to send it back to a client.
  //   serialize(value) {
  //     return value.getTime(); // value sent to the client
  //   },
  //   // gets invoked to parse client input that was passed inline in the query.
  //   parseLiteral(ast) {
  //     if (ast.kind === Kind.INT) {
  //       return parseInt(ast.value, 10); // ast value is always in string format
  //     }
  //     return null;
  //   }
  // })

  // 方式二：
  Date: {
    __parseValue(value) {
      logger.info(`__parseValue: ${value}`);
      return new Date(value).getTime();
    },

    __serialize(value) {
      logger.info(`__serialize: ${value}`);
      return new Date(value).getTime();
    },
    __parseLiteral(ast) {
      logger.info(`__parseLiteral: ${ast.value}`);
      if (ast.kind === Kind.INT) {
        return new Date(Number.parseInt(ast.value, 10));
      } else if (ast.kind === Kind.STRING) {
        return new Date(Number.parseInt(ast.value.replace(/["']/g, ''), 10));
      }
      return null;
    }
  }
};

export { resolvers };
