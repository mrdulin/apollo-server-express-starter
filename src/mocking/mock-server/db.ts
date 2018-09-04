import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';
import casual from 'casual';
import { IUserModel } from '../interfaces';

const adapter = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ users: [] }).write();

const authorId1: string = shortid.generate();
const authorId2: string = shortid.generate();

const users: IUserModel[] = [
  { id: authorId1, name: casual.name, friends: [authorId2] },
  { id: authorId2, name: casual.name, friends: [authorId1] }
];

lowdb.set('users', users).write();

export { lowdb, authorId1, authorId2 };
