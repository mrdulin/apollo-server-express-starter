import { expect } from 'chai';
import http from 'http';
import { Done } from 'mocha';
import { ExecutionResult } from 'graphql';
import casual from 'casual';

import { start } from './server';
import { lowdb, IBook } from './db';
import { request, logger } from '../utils';

import * as Q from './queries';
import * as M from './mutations';

const rp = request();
let server: http.Server;
before(async () => {
  server = await start();
});

after((done: Done) => {
  server.close(done);
});

describe('update-mutation test suites', () => {
  describe('query - books', () => {
    it('should return books correctly when send a query by http get request', async () => {
      const qs = { query: Q.BOOKS };
      const actualValue: ExecutionResult<{ books: IBook[] }> = await rp.get(qs);
      const expectValue: ExecutionResult<{ books: IBook[] }> = {
        data: {
          books: lowdb.get('books').value()
        }
      };

      expect(actualValue).to.be.deep.equal(expectValue);
    });
  });

  describe('mutation - addBook', () => {
    it('should return added book correctly when send a query by http post request', async () => {
      const body = {
        query: M.ADD,
        variables: {
          book: {
            author: 'mrdulin',
            title: 'angular'
          }
        }
      };

      const actualValue: ExecutionResult<{ add: IBook }> = await rp.post(body);
      const expectValue: ExecutionResult<{ add: IBook }> = {
        data: {
          add: lowdb
            .get('books')
            .last()
            .value() as IBook
        }
      };
      logger.info(actualValue);
      expect(actualValue).to.be.deep.equal(expectValue);
    });
  });

  describe('mutation - updateBook', () => {
    it('should return updated book correctly when send a query by http post request', async () => {
      const book: IBook = {
        id: '1',
        title: casual.title,
        author: casual.name
      };
      const body = {
        query: M.UPDATE,
        variables: { book }
      };

      const actualValue: ExecutionResult<{ update: IBook }> = await rp.post(body);
      const expectValue: ExecutionResult<{ update: IBook }> = {
        data: {
          update: lowdb
            .get('books')
            .find({ id: book.id })
            .value() as IBook
        }
      };

      expect(actualValue).to.be.deep.equal(expectValue);
    });
  });
});
