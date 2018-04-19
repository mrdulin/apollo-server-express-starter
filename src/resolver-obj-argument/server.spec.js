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

describe('graphql test suites', () => {
  describe('http post', () => {
    it('should get author correctly', () => {
      const body = {
        query: `
          query author($id: Int!){
            getAuthor(id: $id) {
              name
            }
          }
        `,
        // operationName: 'query author',
        variables: {
          id: 1
        }
      };
      return rp.post(body).then(res => {
        expect(res.data.getAuthor.name).to.equal('lin');
      });
    });
  });

  describe('http get', () => {
    it('should get author correctly', () => {
      const qs = {
        query: `
            query author($id: Int!){
              getAuthor(id: $id) {
                name
              }
            }
          `,
        // operationName: 'query author',
        variables: {
          id: 1
        }
      };

      return rp.get(qs).then(res => {
        expect(res.data.getAuthor.name).to.equal('lin');
      });
    });
  });
});
