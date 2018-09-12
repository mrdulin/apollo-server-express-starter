import { IMocks } from 'graphql-tools';

const mockUsers = [{ id: 'a', name: 'graphql' }];

const mocks: IMocks = {
  Query: () => {
    return {
      allUsers() {
        return mockUsers;
      }
    };
  }
};

export { mocks, mockUsers };
