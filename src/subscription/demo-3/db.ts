import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';
import casual from 'casual';

function createLowdb(options: any = {}) {
  const source: string = options.source || path.resolve(__dirname, `./lowdb-${shortid.generate()}.json`);
  const adapter = new FileSync(source);
  const lowdb = low(adapter);

  const authorId1 = shortid.generate();
  const authorId2 = shortid.generate();

  lowdb.defaults({ users: [], books: [] }).write();

  lowdb.set('users', [{ id: authorId1, name: casual.name }, { id: authorId2, name: casual.name }]).write();
  lowdb
    .set('books', [
      { id: shortid.generate(), title: casual.title, authorId: authorId1 },
      { id: shortid.generate(), title: casual.title, authorId: authorId2 }
    ])
    .write();

  return { lowdb, authorId1, authorId2 };
}

export { createLowdb };
