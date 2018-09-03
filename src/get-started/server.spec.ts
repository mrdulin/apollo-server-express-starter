import { expect } from 'chai';
import http from 'http';
import { Done, reporters } from 'mocha';

import { start, schema, resolvers, IBook, books } from './server';
import { request, logger } from '../utils';
import { graphql, ExecutionResult } from 'graphql';

const rp = request();
let server: http.Server;

before(async () => {
  server = await start();
});

after((done: Done) => {
  server.close(done);
});

describe('get-started test suites', () => {
  it('should return books correctly using graphql function to execute a query', async () => {
    const query: string = `
      query {
        books{
          id
          title
          author
        }
      }
    `;

    const actualValue: ExecutionResult<IBook> = await graphql<IBook>({
      schema,
      source: query,
      rootValue: resolvers
    });

    const expectValue: ExecutionResult<{ books: IBook[] }> = {
      data: {
        books: books.map(
          (book: IBook): IBook => {
            return Object.assign({}, book, { title: book.title.toUpperCase() });
          }
        )
      }
    };

    expect(actualValue).to.be.deep.equal(expectValue);
  });

  it('should return books correctly using http request to send a query', async () => {
    const body = {
      query: `
        query {
          books{
            id
            title
            author
          }
        }
      `
    };
    const actualValue: IBook[] | undefined = await rp.post(body).then(
      (res?: ExecutionResult<{ books: IBook[] }>): IBook[] | undefined => {
        if (res && res.data) {
          return res.data.books;
        }
      }
    );
    const expectValue: IBook[] = books.map(
      (book: IBook): IBook => {
        return Object.assign({}, book, { title: book.title.toUpperCase() });
      }
    );

    if (actualValue) {
      expect(actualValue).to.be.deep.equal(expectValue);
    }
  });
});
