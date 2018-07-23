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

describe('graphql batching query test suites', () => {
  const batchQueries = [
    {
      query: `
        query {
          books{
            title
          }
        }
      `
    },
    {
      query: `
        query {
          bookById(id: "1") {
            title
          }
        }
      `
    }
  ];
  describe('http post', () => {
    it('should get an array of GraphQL responses.', () => {
      return rp.post(batchQueries).then(res => {
        expect(res)
          .to.be.an('array')
          .to.have.lengthOf(batchQueries.length);

        expect(res[0].data.books).to.be.an('array');
        expect(res[1].data.bookById)
          .to.be.an('object')
          .to.have.own.property('title');
      });
    });
  });

  describe('http get', () => {
    it('should get an books correctly', () => {
      const qs = {
        query: `
          query {
            books{
              title
            }
          }
        `
      };
      return rp.get(qs).then(res => {
        expect(res.data.books).to.be.an('array');
      });
    });
    // TODO:
    it('should get an array of GraphQL responses.', () => {
      return rp.get(batchQueries).then(res => {
        console.log('http get:', res);
        expect(res)
          .to.be.an('array')
          .to.have.lengthOf(batchQueries.length);

        expect(res[0].data.books).to.be.an('array');
        expect(res[1].data.bookById)
          .to.be.an('object')
          .to.have.own.property('title');
      });
    });
  });
});
