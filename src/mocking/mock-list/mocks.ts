import { MockList, IMocks } from 'graphql-tools';
import casual from 'casual';
import shortid from 'shortid';

const USER_MIN_NUM = 2;
const USER_MAX_NUM = 6;
const PAGE_SIZE = 10;

const mocks: IMocks = {
  Query: () => {
    return {
      allUsers: () => {
        const mockList = new MockList([USER_MIN_NUM, USER_MAX_NUM], (source, args) => {
          return { id: shortid.generate(), name: casual.name };
        });

        return mockList;
      },
      user: (root, { id }) => {
        return { id, name: casual.name };
      }
    };
  },

  User: (o, { limit, offset }) => {
    return {
      friends: () =>
        new MockList(limit, (parent, args) => {
          return { id: shortid.generate(), name: casual.name };
        })
    };
  }
};

export { mocks, USER_MIN_NUM, USER_MAX_NUM, PAGE_SIZE };
