import { expect } from 'chai';
import { graphql, ExecutionResult } from 'graphql';
import { addMockFunctionsToSchema } from 'graphql-tools';
import _ from 'lodash';

import { schema } from './schema';
import { logger } from '../../utils';
import { lowdb } from '../db';
import { mocks, mockUsers } from './mocks';

describe('addMockFunctionsToSchema test suites', () => {
  it('should return users from lowdb when query allUsers', async () => {
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });
    const query: string = `
      query {
        allUsers{
          id
          name
        }
      }
    `;

    const actualValue: ExecutionResult = await graphql({ schema, source: query });
    const expectValue: ExecutionResult = {
      data: {
        allUsers: lowdb
          .get('users')
          .map(user => ({ id: user.id, name: user.name }))
          .value()
      }
    };

    expect(actualValue).to.be.deep.equal(expectValue);
  });

  it('should return mock users when query allUsers and preserveResolvers is falsy', async () => {
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: false });
    const query: string = `
      query {
        allUsers{
          id
          name
        }
      }
    `;

    const actualValue: ExecutionResult = await graphql({ schema, source: query });
    const expectValue: ExecutionResult = {
      data: {
        allUsers: mockUsers
      }
    };

    expect(actualValue).to.be.deep.equal(expectValue);
  });

  it('should return mock users when query allUsers and omit preserveResolvers option', async () => {
    addMockFunctionsToSchema({ schema, mocks });
    const query: string = `
      query {
        allUsers{
          id
          name
        }
      }
    `;

    const actualValue: ExecutionResult = await graphql({ schema, source: query });
    const expectValue: ExecutionResult = {
      data: {
        allUsers: mockUsers
      }
    };

    expect(actualValue).to.be.deep.equal(expectValue);
  });
});
