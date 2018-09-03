import { expect } from 'chai';
import http from 'http';
import { Done } from 'mocha';
import { graphql, ExecutionResult } from 'graphql';
import _ from 'lodash';

import { start, schema, resolvers, IHero, ICompany, InMermorydb, isHero, isCompany } from './server';
import { request, logger } from '../utils';

const rp = request();
let server: http.Server;

before(async () => {
  server = await start();
});

after((done: Done) => {
  server.close(done);
});

interface ITypename {
  __typename: string;
}

type Hero = IHero & ITypename;
type Company = ICompany & ITypename;

describe('inline-fragment test suites', () => {
  const keyword = 'o';
  const elements: Array<IHero | ICompany> = [];
  const BaseInfofragment: string = `
    fragment BaseInfo on BaseInfo {
      id
      name
    }
  `;

  const expectValue: ExecutionResult<{ search: Array<Hero | Company | undefined> }> = {
    data: {
      search: elements
        .concat(InMermorydb.companies, InMermorydb.heroes)
        .map(
          (el: IHero | ICompany): Hero | Company | undefined => {
            const name: string = el.name;
            // tslint:disable-next-line:variable-name
            let __typename: string = '';
            if (isHero(el)) {
              __typename = 'Hero';
            }

            if (isCompany(el)) {
              __typename = 'Company';
            }

            if (name.indexOf(keyword) !== -1) {
              return Object.assign({}, el, { __typename });
            }
          }
        )
        .filter((v: Hero | Company | undefined): boolean => v !== undefined)
    }
  };

  it('should return correcly value when using graphql function to execute query', async () => {
    const query: string = `
      query search($keyword: String!) {
        search(keyword: $keyword) {
          __typename
          ... on Hero {
            ...BaseInfo
            email
          }
          ... on Company {
            ...BaseInfo
            products
          }
        }
      }

      ${BaseInfofragment}
    `;

    const actualValue = await graphql({
      schema,
      rootValue: resolvers,
      source: query,
      contextValue: {
        db: InMermorydb
      },
      variableValues: {
        keyword
      }
    });

    expect(actualValue).to.be.deep.equal(expectValue);
  });

  it('should return value correctly when send a query by http post request', async () => {
    const body = {
      query: `
        query search($keyword: String!) {
          search(keyword: $keyword) {
            __typename
            ... on Hero {
              ...BaseInfo
              email
            }
            ... on Company {
              ...BaseInfo
              products
            }
          }
        }

        ${BaseInfofragment}
      `,
      variables: {
        keyword
      }
    };

    const actualValue: ExecutionResult<{ search: Array<Hero | Company> }> = await rp.post(body);
    expect(actualValue).to.be.deep.equal(expectValue);
  });
});
