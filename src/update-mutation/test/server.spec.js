const { expect } = require('chai');
const start = require('../server');
const rp = require('../../rp')();
const { lowdb } = require('../db');

const Q = require('../queries');
const M = require('../mutations');

let server;

before(done => {
  server = start(done);
});

after(done => {
  server.close(done);
});

describe('update-mutation', () => {
  it('books query', async () => {
    const qs = {
      query: Q.BOOKS
    };

    const {
      data: { books }
    } = await rp.get(qs);
    expect(books).to.be.an('array');
    expect(books.length).to.equal(
      lowdb
        .get('books')
        .size()
        .value()
    );
  });

  it('add book mutation', async () => {
    const body = {
      mutation: M.ADD,
      variables: {
        author: 'mrdulin',
        title: 'angular'
      }
    };

    const addBookMutationResult = await rp.post(body);
    console.log(addBookMutationResult);
    expect(1).to.equal(1);
  });
});
