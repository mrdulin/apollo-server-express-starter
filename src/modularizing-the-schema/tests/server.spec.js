const { expect } = require('chai');

const req = require('./request');
const { start, stop, port, engine } = require('../server');

before(done => {
  start(done);
});

after(() => {
  return stop(engine);
});

describe('modularizing-the-schema server test suites', () => {
  it('should return correct author', () => {
    const body = {
      query: '{author(firstName: "du", lastName: "lin") { id }}'
    };
    return req(port, body).then(res => {
      expect(res).to.have.nested.property('data.author.id');
      expect(res.data.author.id).to.be.a('string');
    });
  });

  it('should return all authors', () => {
    const body = {
      query: `{allAuthors{
        id
      }}`
    };

    return req(port, body).then(res => {
      console.log(res);
      expect(res.data.allAuthors).to.be.an('array');
    });
  });
});
