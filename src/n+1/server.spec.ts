import { expect } from 'chai';
import http from 'http';
import sinon, { SinonSpy, SinonSpyCall, SinonStub } from 'sinon';

import { start } from './server';
import { IUser, IBook, lowdb } from './db';
import { request, logger } from '../utils';
import { Book, User } from './graphql/models';

let server: http.Server;
before('start server', async () => {
  server = await start();
});

after('stop server', async () => {
  await server.close();
});

describe('n+1 test suites', () => {
  const rp = request();

  const UserModel = User({ db: lowdb });
  const BookModel = Book({ db: lowdb });

  afterEach(() => {
    sinon.restore();
  });

  it('should return correct user when query by user id', async () => {
    const query: string = `
      query user($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `;
    const body = {
      query,
      variables: {
        id: lowdb.getState().users[0].id
      }
    };

    const {
      data: { user }
    } = await rp.post(body);

    if (user) {
      expect(user).to.be.deep.equal(lowdb.getState().users[0]);
    }
  });

  it('should return correct book list when query book list', async () => {
    const query: string = `
      query {
        books{
          id
          title
          author{
            id
            name
          }
        }
      }
    `;
    const body = { query };

    const {
      data: { books: actualValue }
    } = await rp.post(body);
    const books: IBook[] = await BookModel.getAll();
    const expectValue = await Promise.all(
      books.map(async (book: IBook) => {
        const author: IUser = await UserModel.getUserById(book.authorId);
        const bookResponse = { id: book.id, title: book.title, author };
        return bookResponse;
      })
    );

    expect(actualValue).to.be.deep.equal(expectValue);
  });

  // TODO: test getUserById function execution times when using dataloader
});
