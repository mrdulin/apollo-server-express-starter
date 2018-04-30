const start = require('./server');

const { expect } = require('chai');

const rp = require('../rp')();

let server;

before(done => {
  server = start(done);
});

after(done => {
  server.close(done);
});

describe('graphql directive test suites', () => {
  it('should have "author" field when @include condition is truthy ', () => {
    const qs = {
      query: `
        query getBookById($id: ID!, $withAuthor: Boolean!) {
          bookById(id: $id) {
            title
            author @include(if: $withAuthor)
          }
        }
      `,
      variables: {
        id: 1,
        withAuthor: true
      }
    };
    return rp.get(qs).then(res => {
      const { data } = res;
      expect(data.bookById).to.have.own.property('author');
    });
  });

  it('should not have "author" field when @include condition is falsy ', () => {
    const qs = {
      query: `
        query getBookById($id: ID!, $withAuthor: Boolean!) {
          bookById(id: $id) {
            title
            author @include(if: $withAuthor)
          }
        }
      `,
      variables: {
        id: 1,
        withAuthor: false
      }
    };
    return rp.get(qs).then(res => {
      const { data } = res;
      expect(data.bookById).to.not.have.own.property('author');
    });
  });

  it('should not have "author" field when @skip condition is truthy ', () => {
    const qs = {
      query: `
        query getBookById($id: ID!, $withAuthor: Boolean!) {
          bookById(id: $id) {
            title
            author @skip(if: $withAuthor)
          }
        }
      `,
      variables: {
        id: 1,
        withAuthor: true
      }
    };

    return rp.get(qs).then(res => {
      const { data } = res;
      expect(data.bookById).to.not.have.own.property('author');
    });
  });

  it('should have "author" field when @skip condition is falsy ', () => {
    const qs = {
      query: `
        query getBookById($id: ID!, $withAuthor: Boolean!) {
          bookById(id: $id) {
            title
            author @skip(if: $withAuthor)
          }
        }
      `,
      variables: {
        id: 1,
        withAuthor: false
      }
    };

    return rp.get(qs).then(res => {
      const { data } = res;
      expect(data.bookById).to.have.own.property('author');
    });
  });
});
