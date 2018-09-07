import { expect } from 'chai';
import http from 'http';
import { Done } from 'mocha';
import { graphql, ExecutionResult } from 'graphql';
import _ from 'lodash';

import { start, schema, resolvers, IBook, books } from './server';
import { request, logger } from '../utils';

const rp = request();
let server: http.Server;

before(async () => {
  server = await start();
});

after((done: Done) => {
  server.close(done);
});

type Partial<T> = { [P in keyof T]?: T[P] };
type BookPartial = Partial<IBook>;

describe('graphql built-in directives test suites', () => {
  describe('@include', () => {
    it('should have "author" field when @include condition is truthy ', () => {
      const qs = {
        query: `
          query getBookById($id: ID!, $withAuthor: Boolean!) {
            bookById(id: $id) {
              title
              author @include(if: $withAuthor)
            }
          }
        `,
        variables: {
          id: 1,
          withAuthor: true
        }
      };
      return rp.get(qs).then(res => {
        const { data } = res;
        expect(data.bookById).to.have.property('author');
      });
    });

    it('should not have "author" field when @include condition is falsy and send a http post request', () => {
      const body = {
        query: `
          query getBookById($id: ID!, $withAuthor: Boolean!) {
            bookById(id: $id) {
              title
              author @include(if: $withAuthor)
            }
          }
        `,
        variables: {
          id: 1,
          withAuthor: false
        }
      };
      return rp.post(body).then(res => {
        const { data } = res;
        expect(data.bookById).to.not.have.property('author');
      });
    });

    it('should not have "author" field when @include condition is falsy and send a http get request', async () => {
      const id: number = 1;
      const withAuthor: boolean = false;
      const qs = {
        query: `
          query {
            bookById(id: ${id}) {
              id
              title
              author @include(if: ${withAuthor})
            }
          }
        `
      };

      const actualValue: ExecutionResult<{ bookById: BookPartial }> = await rp.get(qs);
      const expectValue: ExecutionResult<{ bookById: BookPartial }> = {
        data: {
          bookById: _.chain<IBook[]>(books)
            .find((book: IBook): boolean => Number.parseInt(book.id, 10) === id)
            .pick(['id', 'title'])
            .value()
        }
      };

      expect(actualValue).to.be.deep.equal(expectValue);
    });

    // tslint:disable-next-line:max-line-length
    it('should not have "author" field when @include condition is falsy and using graphql function to execute query', async () => {
      const id: number = 1;
      const query: string = `
        query getBookById($id: ID!, $withAuthor: Boolean!) {
          bookById(id: $id) {
            id
            title
            author @include(if: $withAuthor)
          }
        }
      `;

      const actualValue: ExecutionResult<IBook> = await graphql<IBook>({
        schema,
        rootValue: resolvers,
        source: query,
        variableValues: {
          id,
          withAuthor: false
        }
      });

      const expectValue: ExecutionResult<{ bookById: BookPartial | undefined }> = {
        data: {
          bookById: _.chain<IBook[]>(books)
            .find((book: IBook): boolean => Number.parseInt(book.id, 10) === id)
            .pick(['id', 'title'])
            .value()
        }
      };

      expect(actualValue).to.be.deep.equal(expectValue);
    });
  });

  describe('@skip', () => {
    it('should not have "author" field when @skip condition is truthy ', () => {
      const qs = {
        query: `
          query getBookById($id: ID!, $withAuthor: Boolean!) {
            bookById(id: $id) {
              title
              author @skip(if: $withAuthor)
            }
          }
        `,
        variables: {
          id: 1,
          withAuthor: true
        }
      };

      return rp.get(qs).then(res => {
        const { data } = res;
        expect(data.bookById).to.not.have.property('author');
      });
    });
    it('should have "author" field when @skip condition is falsy and send a http post request', () => {
      const body = {
        query: `
          query getBookById($id: ID!, $withAuthor: Boolean!) {
            bookById(id: $id) {
              title
              author @skip(if: $withAuthor)
            }
          }
        `,
        variables: {
          id: 1,
          withAuthor: false
        }
      };

      return rp.post(body).then(res => {
        const { data } = res;
        expect(data.bookById).to.have.property('author');
      });
    });

    it('should return null when query book.name', async () => {
      const query: string = `
        query {
          books {
            name
          }
        }
      `;

      const actualValue: ExecutionResult<Array<{ name: null }>> = await graphql<Array<{ name: null }>>({
        schema,
        rootValue: resolvers,
        source: query
      });

      const expectValue: ExecutionResult<{ books: Array<{ name: null }> }> = {
        data: {
          books: [{ name: null }, { name: null }]
        }
      };

      expect(actualValue).to.be.deep.equal(expectValue);
    });
  });
});
