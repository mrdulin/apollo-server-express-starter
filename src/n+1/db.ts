import low, { AdapterSync, LoDashExplicitSyncWrapper, LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';
import casual from 'casual';

import { logger, getRandomInt } from '../utils';

const adapter: AdapterSync<any> = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb: LowdbSync<IDb> = low(adapter);

interface IUser {
  id: string;
  name: string;
}

interface IBook {
  id: string;
  title: string;
  authorId: string;
}

interface IDb {
  books: IBook[];
  users: IUser[];
}

function generateData(): IDb {
  const books: IBook[] = [];
  const users: IUser[] = [];

  for (let i: number = 0; i < 2; i++) {
    const user: IUser = { id: shortid.generate(), name: casual.name };
    users.push(user);
  }

  for (let i: number = 0; i < 10; i++) {
    const ranInt: number = getRandomInt(0, users.length - 1);
    const { id: authorId }: { id: string } = users[ranInt];
    const book: IBook = { id: shortid.generate(), title: casual.title, authorId };
    books.push(book);
  }

  return { books, users };
}

async function seed(): Promise<LoDashExplicitSyncWrapper<any>> {
  const db: LoDashExplicitSyncWrapper<any> = await connect();
  lowdb.defaults({ books: [], users: [] }).write();
  const { books, users }: IDb = generateData();
  lowdb.set('books', books).write();
  lowdb.set('users', users).write();
  logger.info('database initialize successfully');
  return db;
}

function connect(): Promise<LoDashExplicitSyncWrapper<any>> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(lowdb);
    }, 200);
  });
}

export { seed, connect, lowdb, IUser, IBook };
