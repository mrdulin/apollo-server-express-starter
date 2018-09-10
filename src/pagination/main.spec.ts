import { expect } from 'chai';
import http from 'http';
import { Done } from 'mocha';
import { Mongoose } from 'mongoose';
import _ from 'lodash';

import { main } from './main';
import { request, logger } from '../utils';
import { Book } from './database/models';
import { TOTAL, books, seed } from './database/seed';

let server: http.Server;
let conn: Mongoose | undefined;
before(async () => {
  conn = await seed(Book, 'Book', books);
  server = await main();
});

after((done: Done) => {
  server.close(async () => {
    if (conn) {
      await conn.disconnect();
    }
    done();
  });
});

describe('pagination test suites', () => {
  describe('booksByOffset', () => {
    it('should always return datas of first page when not pass offset and limit', async () => {
      const queries: Array<Promise<any>> = [];
      for (let i = 0; i < 3; i += 1) {
        queries.push(Book.booksByOffset());
      }
      const results = await Promise.all(queries);
      results.forEach(({ docs, total }) => {
        expect(docs).to.have.lengthOf(10);
        expect(total).to.be.eql(TOTAL);
      });
    });

    it('should return correct value when pass offset and limit', async () => {
      const limit: number = 10;
      for (let offset = 0; offset < 3; offset += 1) {
        const { docs, total } = await Book.booksByOffset(offset, limit);
        expect(total).to.be.eql(TOTAL);
        if (offset > 1) {
          expect(docs).to.have.lengthOf(0);
        } else {
          expect(docs).to.have.lengthOf(limit);
        }
      }
    });
  });

  describe('booksByCursor', () => {
    it('should return correct value', async () => {
      const limit: number = 10;
      const { docs, total } = await Book.booksByCursor(limit);
      expect(total).to.be.equal(TOTAL);
      expect(docs).to.have.lengthOf(limit);
      const lastDoc: any = _.last(docs);
      const lastBook: any = _.chain(books)
        .slice(0, limit)
        .last()
        .value();
      if (lastDoc && lastBook) {
        expect(lastDoc._id.toString()).to.be.eql(lastBook._id.toString());
      }
    });

    it('should return empty when cursor is last', async () => {
      const limit: number = 10;
      const lastBook: any = _.chain(books)
        .last()
        .value();

      if (lastBook) {
        const { docs, total } = await Book.booksByCursor(limit, lastBook._id.toString());
        expect(total).to.be.equal(TOTAL);
        expect(docs).to.have.lengthOf(0);
      }
    });
  });
});
