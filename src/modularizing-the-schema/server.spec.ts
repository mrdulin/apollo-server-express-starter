import { expect } from 'chai';
import http from 'http';
import { Done } from 'mocha';

import { start } from './server';
import { request, logger } from '../utils';
import { lowdb } from './db';

const rp = request();

let server: http.Server;
before(async () => {
  server = await start();
});

after((done: Done) => {
  server.close(done);
});

describe('modularizing-the-schema test suites', () => {
  const id: string = lowdb.get('authors[0].id').value();

  logger.info(`id: ${id}`);

  describe('http post requests', () => {
    it('should return correct author', () => {
      const body = {
        query: `
          query {
            author(id: ${JSON.stringify(id)}) {
              id
            }
          }
        `
      };
      return rp.post(body).then(res => {
        logger.info(res);
        expect(res).to.have.nested.property('data.author.id');
        expect(res.data.author.id).to.be.a('string');
      });
    });

    it('should return all authors', () => {
      const body = {
        query: `
          {
            allAuthors{
              id
            }
          }
        `
      };

      return rp.post(body).then(res => {
        expect(res.data.allAuthors).to.be.an('array');
      });
    });

    it('should return a cookie string', () => {
      const body = {
        query: `
          query {
            getFortuneCookie
          }
        `
      };
      return rp.post(body).then(res => {
        expect(res.data.getFortuneCookie).to.be.a('string');
      });
    });
  });

  describe('http get requests', () => {
    it('should return correct author', () => {
      const body = {
        query: `
          query {
            author(id: ${JSON.stringify(id)}) {
              id
            }
          }
        `
      };
      return rp.get(body).then(res => {
        expect(res).to.have.nested.property('data.author.id');
        expect(res.data.author.id).to.be.a('string');
      });
    });

    it('should return all authors', () => {
      const body = {
        query: `
          {
            allAuthors{
              id
            }
          }
        `
      };

      return rp.get(body).then(res => {
        expect(res.data.allAuthors).to.be.an('array');
      });
    });

    it('should return a cookie string', () => {
      const body = {
        query: `
          query {
            getFortuneCookie
          }
        `
      };
      return rp.get(body).then(res => {
        expect(res.data.getFortuneCookie).to.be.a('string');
      });
    });
  });
});
