const { expect } = require('chai');

const RequestFactory = require('./request');
const { start, stop, port, engine } = require('../server');

const req = RequestFactory(port);

before(done => {
  start(done);
});

after(() => {
  return stop(engine);
});

describe('modularizing-the-schema server test suites', () => {
  describe('http post requests', () => {
    it('should return correct author', () => {
      const body = {
        query: 'query {author(firstName: "du", lastName: "lin") { id }}'
      };
      return req.post(body).then(res => {
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

      return req.post(body).then(res => {
        // console.log(res);
        expect(res.data.allAuthors).to.be.an('array');
      });
    });

    it('should return a cookie string', () => {
      const body = {
        query: 'query {getFortuneCookie}'
      };
      return req.post(body).then(res => {
        // console.log(res);
        expect(res.data.getFortuneCookie).to.be.a('string');
      });
    });
  });

  describe('http get requests', () => {
    it('should return correct author', () => {
      const body = {
        query: 'query {author(firstName: "du", lastName: "lin") { id }}'
      };
      return req.get(body).then(res => {
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

      return req.get(body).then(res => {
        // console.log(res);
        expect(res.data.allAuthors).to.be.an('array');
      });
    });

    it('should return a cookie string', () => {
      const body = {
        query: 'query {getFortuneCookie}'
      };
      return req.get(body).then(res => {
        // console.log(res);
        expect(res.data.getFortuneCookie).to.be.a('string');
      });
    });
  });
});
