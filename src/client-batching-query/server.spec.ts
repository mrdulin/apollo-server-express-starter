import { expect } from 'chai';
import http from 'http';

import { start, bookId1 } from './server';
import { request, logger } from '../utils';

const rp = request();
let server: http.Server;
before(async () => {
  server = await start();
});

after(done => {
  server.close(done);
});

describe('graphql batching query test suites', () => {
  describe('http post', () => {
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
            bookById(id: ${JSON.stringify(bookId1)}) {
              title
            }
          }
        `
      }
    ];
    it('should get an array of GraphQL responses.', () => {
      return rp.post(batchQueries).then(res => {
        expect(res)
          .to.be.an('array')
          .to.have.lengthOf(batchQueries.length);

        expect(res[0].data.books).to.be.an('array');
        expect(res[1].data.bookById)
          .to.be.an('object')
          .to.have.property('title');
      });
    });
  });

  describe('http get', () => {
    const batchQueries = {
      query: `
        query {
          books{
            title
          }
          bookById(id: ${JSON.stringify(bookId1)}) {
            title
          }
        }
      `
    };
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
    it('should get an array of GraphQL responses.', () => {
      return rp.get(batchQueries).then(res => {
        expect(res.data.books).to.be.an('array');
        expect(res.data.bookById)
          .to.be.an('object')
          .to.have.property('title');
      });
    });
  });
});
