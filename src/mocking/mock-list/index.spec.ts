import { mockServer, IMockServer } from 'graphql-tools';
import { ExecutionResult } from 'graphql';
import { expect } from 'chai';

import { typeDefs } from '../typeDefs';
import { logger } from '../../utils';
import { mocks, USER_MIN_NUM, USER_MAX_NUM, PAGE_SIZE } from './mocks';

const mockserver: IMockServer = mockServer(typeDefs, mocks);

describe('mockList test suites', () => {
  it('should get an array of user, the length of array is between 2,4', async () => {
    const query: string = `
      query {
        allUsers{
          id
          name
        }
      }
    `;

    const actualValue: ExecutionResult = await mockserver.query(query);

    if (actualValue.data) {
      const users = actualValue.data.allUsers;

      expect(users)
        .to.be.an('array')
        .to.have.lengthOf.within(USER_MIN_NUM, USER_MAX_NUM);
      users.forEach(user => {
        expect(user).to.have.property('id');
        expect(user).to.have.property('name');
      });
    }
  });

  it('should get a user correctly', async () => {
    const userId = '"whatever"';
    const query: string = `
      {
        user(id: ${userId}) {
          id
          name
        }
      }
    `;

    const actualValue: ExecutionResult = await mockserver.query(query);
    if (actualValue.data) {
      const { user } = actualValue.data;
      expect(user.id).to.be.equal(JSON.parse(userId));
      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
    }
  });

  it('should get a user correctly with variables', async () => {
    const userId = 'whatever';
    const query: string = `
      query user ($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `;
    const variables = { id: userId };
    const actualValue: ExecutionResult = await mockserver.query(query, variables);
    if (actualValue.data) {
      const { user } = actualValue.data;
      expect(user.id).to.be.equal(userId);
      expect(user).to.have.property('name');
    }
  });

  it('should get friends of a user correctly', async () => {
    const query: string = `
      query user($id: ID!, $limit: Int, $offset: Int) {
        user(id: $id, limit: $limit, offset: $offset) {
          id
          name
          friends {
            id
            name
          }
        }
      }
    `;
    const variables = {
      id: 'whatever',
      limit: 2,
      offset: 0
    };

    const actualValue: ExecutionResult = await mockserver.query(query, variables);
    if (actualValue.data) {
      const { user } = actualValue.data;
      logger.info(user);
      expect(user.id).to.be.equal(variables.id);
      expect(user).to.have.property('name');
      expect(user.friends)
        .to.be.an('array')
        .to.have.lengthOf(variables.limit);
      user.friends.forEach(friend => {
        expect(friend).to.have.property('id');
        expect(friend).to.have.property('name');
      });
    }
  });
});
