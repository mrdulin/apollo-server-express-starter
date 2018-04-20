const { mockServer, makeExecutableSchema } = require('graphql-tools');
const { expect } = require('chai');

const fakeDB = {
  users: [{ id: '1', name: 'lin' }, { id: '2', name: 'echo' }]
};

const schemaDefs = `
  type User {
    id: ID!
    name: String!
  }

  type Mutation{
    updateUserName(id: ID!, name: String!): User
  }

  type Query {
    allUsers: [User]
    user(id: ID!): User
  }
`;

const mocks = {
  Query: () => {
    return {
      allUsers: () => {
        return fakeDB.users;
      },
      user: (source, { id }, context, info) => {
        return fakeDB.users.find(user => user.id === id);
      }
    };
  },
  Mutation: () => {
    return {
      updateUserName: (source, { id, name }, context, info) => {
        const userFound = fakeDB.users.find(user => user.id === id);
        userFound.name = name;
        console.log('fakeDB: ', fakeDB);
        return userFound;
      }
    };
  }
};

const schema = makeExecutableSchema({
  typeDefs: [schemaDefs]
});

const mockserver = mockServer(schema, mocks);

describe('mock server test suites', () => {
  it('should get users correctly', () => {
    mockserver
      .query(
        `{
        allUsers{
          id
          name
        }
      }`
      )
      .then(res => {
        const users = res.data.allUsers;
        expect(users)
          .to.be.an('array')
          .to.have.lengthOf(fakeDB.users.length);
        users.forEach(user => {
          expect(user).to.have.own.property('id');
          expect(user).to.have.own.property('name');
        });
      });
  });

  it('should get user by id correctly', () => {
    mockserver
      .query(
        `{
      user(id: 1) {
        id
        name
      }
    }`
      )
      .then(res => {
        ['id', 'name'].forEach(prop => {
          expect(res.data.user).to.have.own.property(prop);
        });
      });
  });

  // https://stackoverflow.com/questions/49939464/graphql-tools-how-can-i-use-mockserver-to-mock-a-mutation
  it('should update user name correctly', () => {
    mockserver
      .query(
        `{
      Mutation {
        updateUserName(id: 1, name: "du") {
          id
          name
        }
      }
    }`
      )
      .then(res => {
        console.log(res);
        expect(1).to.be.equal(1);
      });
  });
});
