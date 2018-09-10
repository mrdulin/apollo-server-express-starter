import { Types, Mongoose, Model } from 'mongoose';
import casual from 'casual';

import { mongooseConnect } from '.';
import { logger } from '../../utils';

const TOTAL: number = 20;

function generateDatas(count = 2) {
  const datas: any[] = [];
  for (let i = 0; i < count; i += 1) {
    const data = {
      _id: Types.ObjectId(),
      title: casual.title,
      author: casual.full_name
    };
    datas.push(data);
  }
  return datas;
}

const books = generateDatas(TOTAL);

async function seed(model: Model<any>, modelName: string, datas: any[]): Promise<Mongoose | undefined> {
  const conn: Mongoose | undefined = await mongooseConnect();

  try {
    const collections: any[] = await model.db.db.listCollections().toArray();
    if (collections.length) {
      await model.collection.dropIndexes();
      await model.collection.drop();
      logger.info(`Drop collection of ${modelName} and indexes successfully`);
    }
  } catch (error) {
    logger.error(error);
  }

  try {
    await model.insertMany(datas);
    logger.info(`Initialize ${modelName} successfully`);
  } catch (error) {
    logger.error(error);
  }

  return conn;
}

export { TOTAL, books, seed };
