import { mockServer, IMockServer } from 'graphql-tools';
import { ExecutionResult } from 'graphql';
import { expect } from 'chai';

import { typeDefs } from '../typeDefs';
import { mocks } from './mocks';
import { lowdb as db, authorId1, authorId2 } from './db';
import { IUserModel, IUser } from '../interfaces';
import { logger } from '../../utils';

const mockserver: IMockServer = mockServer(typeDefs, mocks);

describe('mockServer test suites', () => {
  it('should get users correctly', async () => {
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
      const users: IUser[] = actualValue.data.allUsers;
      expect(users)
        .to.be.an('array')
        .to.have.lengthOf(
          db
            .get('users')
            .size()
            .value()
        );
      users.forEach((user: IUser) => {
        expect(user).to.have.property('id');
        expect(user).to.have.property('name');
      });
    }
  });

  it('should get user by id correctly', async () => {
    const query: string = `
      query user($id: ID!){
        user(id: $id) {
          id
          name
        }
      }
    `;
    const variables = { id: authorId1 };
    const actualValue: ExecutionResult = await mockserver.query(query, variables);

    if (actualValue.data) {
      const user: IUser = actualValue.data.user;
      const props: string[] = ['id', 'name'];
      props.forEach((prop: string) => {
        expect(user).to.have.property(prop);
      });
    }
  });

  it('should get user by id correcly with friends', async () => {
    const query: string = `
      query user($id: ID!){
        user(id: $id) {
          id
          name
          friends {
            id
            name
          }
        }
      }
    `;
    const variables = { id: authorId1 };
    const actualValue: ExecutionResult = await mockserver.query(query, variables);
    if (actualValue.data) {
      const user: IUserModel = actualValue.data.user;
      logger.info(user);
      const props: string[] = ['id', 'name', 'friends'];
      props.forEach((prop: string) => {
        expect(user).to.have.property(prop);
      });
      expect(user.friends).to.have.lengthOf(1);
    }
  });

  // https://stackoverflow.com/questions/49939464/graphql-tools-how-can-i-use-mockserver-to-mock-a-mutation
  // it('should update user name correctly', () => {
  //   mockserver
  //     .query(
  //       `{
  //     Mutation {
  //       updateUserName(id: 1, name: "du") {
  //         id
  //         name
  //       }
  //     }
  //   }`
  //     )
  //     .then(res => {
  //       console.log(res);
  //       expect(1).to.be.equal(1);
  //     });
  // });
});
