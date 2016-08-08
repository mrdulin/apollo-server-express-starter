import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import {
  makeExecutableSchema,
  IResolvers,
  IResolverObject
} from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import cors from 'cors';
import casual from 'casual';
import shortid from 'shortid';
import http from 'http';

import { logger } from '../utils';
import { config } from '../config';

enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
  MEMBER = 'member'
}

const userDatas = [
  {
    user_id: 1,
    user_nme: casual.name,
    user_email: casual.email,
    user_role: UserRole.ADMIN,
    user_card_num: casual.card_number()
  },
  {
    user_id: 2,
    user_nme: casual.name,
    user_email: casual.email,
    user_role: UserRole.GUEST,
    user_card_num: casual.card_number()
  },
  {
    user_id: 2,
    user_nme: casual.name,
    user_email: casual.email,
    user_role: UserRole.MEMBER,
    user_card_num: casual.card_number()
  }
];

const typeDefs: string = `
  enum UserRole {
    admin
    guest
    member
  }

  type User {
    user_id: ID!
    user_nme: String
    user_email: String!
    user_role: UserRole!

    user_card_num: String
  }

  type Query {
    user(id: ID!): User
    users: [User]!
  }
`;

interface IAuthResolverInput {
  field: string;
  roles: string[];
}

const authResolver = ({
  field,
  roles
}: IAuthResolverInput): IResolverObject => {
  return {
    [field]: user => {
      if (roles.includes(user.user_role)) {
        return user[field];
      }
      return null;
    }
  };
};

const resolvers: IResolvers = {
  User: Object.assign(
    {},
    ...['user_id', 'user_nme', 'user_email', 'user_role'].map((key: string) => {
      const resolverObject: IResolverObject = {
        [key]: async obj => {
          return obj[key];
        }
      };
      return resolverObject;
    }),
    authResolver({
      field: 'user_card_num',
      roles: [UserRole.ADMIN, UserRole.MEMBER]
    })
  ),
  Query: {
    user: async (_, { id }, { users }) => {
      return users.find(user => user.user_id.toString() === id);
    },
    users: async (_, args, { users }) => {
      return users;
    }
  }
};

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  app.use(cors());
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress(req => {
      return {
        schema,
        context: {
          users: userDatas
        }
      };
    })
  );
  app.use(
    config.GRAPHIQL_ROUTE,
    graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE })
  );

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start, schema, resolvers };
