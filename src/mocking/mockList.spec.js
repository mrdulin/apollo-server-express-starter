const { mockServer, MockList, makeExecutableSchema } = require('graphql-tools');
const { expect } = require('chai');
const casual = require('casual');

const { schemaDefs } = require('./schema');

const schema = makeExecutableSchema({
  typeDefs: [schemaDefs]
});

const USER_MIN_NUM = 2;
const USER_MAX_NUM = 6;
const PAGE_SIZE = 10;

const mocks = {
  Query: () => {
    return {
      allUsers: () => {
        const mockList = new MockList([USER_MIN_NUM, USER_MAX_NUM], (source, args, context, info) => {
          return { id: casual.id, name: casual.name };
        });
        // console.log('mockList: ', mockList);
        return mockList;
      },
      user: (source, { id }, context, info) => {
        return { id, name: casual.name };
      }
    };
  },
  User: user => {
    // console.log('user: ', user);
    return {
      paginatedFriends: (o, { pageNo }) => {
        // console.log('pageNo: ', pageNo);
        return new MockList(pageNo * PAGE_SIZE, () => {
          return { id: casual.id, name: casual.name };
        });
      }
    };
  }
};

const mockserver = mockServer(schema, mocks);

describe('mockList test suites', () => {
  it('should get an array of user, the length of array is between 2,4', () => {
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
        // console.log('res: ', res, users);
        expect(users)
          .to.be.an('array')
          .to.have.lengthOf.within(USER_MIN_NUM, USER_MAX_NUM);
        users.forEach(user => {
          expect(user).to.have.own.property('id');
          expect(user).to.have.own.property('name');
        });
      });
  });

  it('should get a user correctly', () => {
    const userId = '"whatever"';
    mockserver
      .query(
        `{
      user(id: ${userId}) {
        id
        name
      }
    }`
      )
      .then(res => {
        // console.log(res);
        const { user } = res.data;
        expect(user.id).to.be.equal(JSON.parse(userId));
        expect(user).to.have.own.property('id');
        expect(user).to.have.own.property('name');
      });
  });

  it('should get friends of a user correctly', () => {
    const userId = '"whatever"';
    const pageNo = 1;
    mockserver
      .query(
        `{
      user(id: ${userId}) {
        id
        name
        paginatedFriends(pageNo: ${pageNo}){
          id
          name
        }
      }
    }`
      )
      .then(res => {
        const { user } = res.data;
        // console.log(user, user.paginatedFriends[0], user.paginatedFriends.length);
        expect(user.id).to.be.equal(JSON.parse(userId));
        expect(user).to.have.own.property('id');
        expect(user).to.have.own.property('name');
        expect(user.paginatedFriends)
          .to.be.an('array')
          .to.have.lengthOf(pageNo * PAGE_SIZE);
        user.paginatedFriends.forEach(friend => {
          expect(friend).to.have.own.property('id');
          expect(friend).to.have.own.property('name');
        });
      });
  });
});
