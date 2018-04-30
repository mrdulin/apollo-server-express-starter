const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const fakeDB = {
  heroes: [{ id: '1', name: 'lin', email: 'novaline@qq.com' }, { id: '2', name: 'echo', email: 'echo@qq.com' }],
  companies: [
    { id: '1', companyName: 'google', products: ['hangout'] },
    { id: '2', companyName: 'facebook', products: ['fackbook'] }
  ]
};

const typeDefs = `
  type Hero {
    id: ID!
    name: String
    email: String
  }
  type Company {
    id: ID!
    companyName: String
    products: [String]
  }

  union HeroAndCompany = Hero | Company

  type Query {
    hero(id: ID!): Hero
    search(keyword: String!): [HeroAndCompany]!
  }
`;

const resolvers = {
  Query: {
    hero: (_, { id, keyword }, ctx) => {
      return fakeDB.heroes.find(hero => hero.id === id);
    },
    search: (_, { keyword }, ctx) => {
      const datas = fakeDB.companies.concat(fakeDB.heroes);
      const dataSearched = datas.filter(data => {
        const name = data.name || data.companyName;
        return name.indexOf(keyword) !== -1;
      });

      console.log('dataSearched: ', dataSearched);

      return dataSearched;
    }
  },
  HeroAndCompany: {
    __resolveType: obj => {
      if (obj.companyName) return 'Company';
      if (obj.name) return 'Hero';
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

function start(done) {
  const app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  return app.listen(3000, () => {
    if (done) done();
    console.log('Go to http://localhost:3000/graphiql to run queries!');
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = start;
