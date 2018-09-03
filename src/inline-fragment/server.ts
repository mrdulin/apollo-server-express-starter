import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress, GraphQLOptions } from 'apollo-server-express';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import http from 'http';

import { logger } from '../utils';
import { config } from '../config';

interface IHero {
  id: string;
  name: string;
  email: string;
}

interface ICompany {
  id: string;
  name: string;
  products: string[];
}

interface IDb {
  heroes: IHero[];
  companies: ICompany[];
}

function isHero(el: IHero | ICompany): el is IHero {
  return (el as IHero).email !== undefined;
}

function isCompany(el: IHero | ICompany): el is ICompany {
  return (el as ICompany).products !== undefined;
}

const InMermorydb: IDb = {
  heroes: [{ id: '1', name: 'lin', email: 'novaline@qq.com' }, { id: '2', name: 'echo', email: 'echo@qq.com' }],
  companies: [{ id: '1', name: 'google', products: ['hangout'] }, { id: '2', name: 'facebook', products: ['fackbook'] }]
};

const typeDefs: string = `

  interface BaseInfo {
    id: ID!
    name: String
  }

  type Hero implements BaseInfo {
    id: ID!
    name: String
    email: String
  }
  type Company implements BaseInfo {
    id: ID!
    name: String
    products: [String]
  }

  union HeroAndCompany = Hero | Company

  type Query {
    hero(id: ID!): Hero
    search(keyword: String!): [HeroAndCompany]!
  }
`;

const resolvers: IResolvers = {
  Query: {
    hero: (_, { id }, { db }): IHero => {
      return db.heroes.find((hero: IHero): boolean => hero.id === id);
    },
    search: (_, { keyword }, { db }): Array<IHero | ICompany> => {
      const datas: Array<IHero | ICompany> = db.companies.concat(db.heroes);
      const dataSearched: Array<IHero | ICompany> = datas.filter(
        (data: IHero | ICompany): boolean => {
          return data.name.indexOf(keyword) !== -1;
        }
      );

      return dataSearched;
    }
  },
  HeroAndCompany: {
    __resolveType: (obj: IHero | ICompany) => {
      if (isHero(obj)) {
        return 'Hero';
      }

      if (isCompany(obj)) {
        return 'Company';
      }

      return null;
    }
  }
};

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

async function start(): Promise<http.Server> {
  const app: express.Application = express();
  app.use(
    config.GRAPHQL_ROUTE,
    bodyParser.json(),
    graphqlExpress(
      (req?: express.Request): GraphQLOptions => {
        return {
          schema,
          context: {
            db: InMermorydb
          }
        };
      }
    )
  );
  app.use(config.GRAPHIQL_ROUTE, graphiqlExpress({ endpointURL: config.GRAPHQL_ROUTE }));

  return app.listen(config.PORT, () => {
    logger.info(`Go to ${config.GRAPHQL_ENDPOINT} to run queries!`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
export { start, schema, resolvers, IHero, ICompany, InMermorydb, isHero, isCompany };
