import low, { AdapterSync, LoDashExplicitSyncWrapper } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';
import casual from 'casual';

import { logger } from '../utils';

const adapter: AdapterSync<any> = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb: LoDashExplicitSyncWrapper<any> = low(adapter);

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData() {
  const books: any[] = [];
  const users: any[] = [];

  for (let i = 0; i < 2; i++) {
    const user = { id: shortid.generate(), name: casual.name };
    users.push(user);
  }

  for (let i = 0; i < 10; i++) {
    const ranInt: number = getRandomInt(0, users.length - 1);
    const { id: authorId }: { id: string } = users[ranInt];
    const book = { id: shortid.generate(), title: casual.title, authorId };
    books.push(book);
  }

  return { books, users };
}

async function seed() {
  const db = await connect();
  lowdb.defaults({ books: [], users: [] }).write();
  const { books, users } = generateData();
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

export { seed, connect, lowdb };
