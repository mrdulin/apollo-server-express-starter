import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';
import casual from 'casual';
import cluster from 'cluster';
import mkdirp from 'mkdirp';
import { logger } from '../../utils';

async function createLowdb(options: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const dir: string = './databaseStorage';
    mkdirp(path.resolve(__dirname, dir), err => {
      if (err) {
        logger.error(err);
        reject(err);
        return;
      }

      let source: string = options.source;
      if (cluster.isWorker) {
        source = path.resolve(__dirname, `${dir}/lowdb-${cluster.worker.id}.json`);
      } else if (cluster.isMaster) {
        source = path.resolve(__dirname, `${dir}/lowdb.json`);
      }
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

      resolve({ lowdb, authorId1, authorId2 });
    });
  });
}

export { createLowdb };
