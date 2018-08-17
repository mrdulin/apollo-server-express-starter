import { LoDashExplicitSyncWrapper } from 'lowdb';
import DataLoader from 'dataloader';

import { logger } from '../../../utils';

const User = ({ db, collectionName = 'users' }: { db: LoDashExplicitSyncWrapper<any>; collectionName?: string }) => {
  function getUsersById(ids: string[]): Promise<any[]> {
    const promises: Array<Promise<any>> = [];
    for (const id of ids) {
      promises.push(getUserById(id));
    }
    return Promise.all(promises);
  }

  function getUserById(id: string): any {
    logger.info(`getUserById: ${id}`);
    return new Promise(resolve => {
      setTimeout(() => {
        const user = db
          .get(collectionName)
          .find({ id })
          .value();
        resolve(user);
      }, 1000);
    });
  }

  return {
    getUsersById,
    getUserById,
    dataloaders: {
      userById: new DataLoader((ids: string[]) => getUsersById(ids))
    }
  };
};

export { User };
