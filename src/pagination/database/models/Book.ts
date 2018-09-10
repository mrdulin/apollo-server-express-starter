import { Schema, model, Document, Model } from 'mongoose';
import _ from 'lodash';

import { connectionFromArray, IConnectionArguments, IConnection } from './connection';
import { logger } from '../../../utils';

interface IBookDocument extends Document {
  title: string;
  author: string;
}

interface IBook extends IBookDocument {
  test(): void;
}

interface IBookModel extends Model<IBook> {
  booksByCursor(limit: number, id?: string): any;
  booksByOffset(offset?: number, limit?: number): any;
  booksByRelayStyleCursor(before: string, after: string, first: number, last: number): IConnection<IBook>;
}

const bookSchema: Schema = new Schema({
  title: String,
  author: String
});

async function booksByCursor(this: IBookModel, limit: number, id?: string) {
  const conditions = id ? { _id: { $gt: id } } : {};
  let docs: IBook[] = [];
  try {
    docs = await this.find(conditions)
      .limit(limit)
      .exec();
  } catch (err) {
    logger.error(err);
    docs = [];
  }

  const total: number = await this.countDocuments();

  return {
    docs,
    total
  };
}

async function booksByOffset(this: IBookModel, offset?: number, limit?: number) {
  const actualOffset: number = offset ? offset : 0;
  const actualLimit: number = limit ? limit : 10;
  const total: number = await this.countDocuments();
  if (total <= actualOffset * actualLimit) {
    return {
      docs: [],
      total
    };
  }

  const docs: IBook[] = await this.find()
    .skip(actualOffset * actualLimit)
    .limit(actualLimit)
    .exec();

  return {
    docs,
    total
  };
}

async function booksByRelayStyleCursor(this: IBookModel, args: IConnectionArguments): Promise<IConnection<IBook>> {
  let docs: IBook[] = [];
  try {
    docs = await this.find();
  } catch (error) {
    logger.error(error);
  }

  return connectionFromArray(docs, args);
}

bookSchema.static({ booksByCursor, booksByOffset, booksByRelayStyleCursor });

const Book: IBookModel = model<IBook, IBookModel>('Book', bookSchema);

export { Book };
