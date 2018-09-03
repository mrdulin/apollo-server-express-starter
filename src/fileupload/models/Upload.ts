import shortid from 'shortid';
import fs from 'fs';
import mkdirp from 'mkdirp';

import { logger } from '../../utils';

interface IFileStream {
  stream: any;
  filename: string;
  mimetype: string;
  encoding: string;
}

interface IFile {
  id: string;
  filepath: string;
  mimetype: string;
  encoding: string;
  filename: string;
}

class Upload {
  public dir: string;
  public collectionName: string;

  constructor(options) {
    this.dir = options.dir;
    this.collectionName = options.collectionName;
    this.init();
  }

  public getAll(db) {
    return db.get(this.collectionName).value();
  }

  public singleUpload(file, db) {
    return this.processUpload(file, db);
  }

  public multipleUpload(files, db) {
    return Promise.all(files.map(file => this.processUpload(file, db)));
  }

  private init() {
    mkdirp(this.dir, (err: NodeJS.ErrnoException) => {
      if (err) {
        logger.error(err);
        return;
      }
      logger.info('Make upload directory successfully');
    });
  }

  private async processUpload(upload: Promise<IFileStream>, db) {
    try {
      const { stream, filename, mimetype, encoding }: IFileStream = await upload;
      const { id, filepath } = await this.storeFS(stream, filename);
      return this.storeDB({ id, filepath, mimetype, encoding, filename }, db);
    } catch (err) {
      logger.error(err);
      throw new Error(err);
    }
  }

  private storeDB(file: IFile, db): IFile {
    return db
      .get(this.collectionName)
      .push(file)
      .last()
      .write();
  }

  private storeFS(stream: any, filename: string): Promise<{ id: string; filepath: string }> {
    const id: string = shortid.generate();
    const filepath: string = `${this.dir}/${id}-${filename}`;
    return new Promise((resolve, reject) => {
      stream.on('error', err => {
        if (stream.truncated) {
          // Delete the truncated file
          fs.unlinkSync(filepath);
        }
        reject(err);
      });

      stream
        .pipe(fs.createWriteStream(filepath))
        .on('error', err => reject(err))
        .on('finish', () => resolve({ id, filepath }));
    });
  }
}

export { Upload };
