import { LoDashExplicitSyncWrapper } from 'lowdb';
import DataLoader from 'dataloader';

const User = ({ db, collectionName = 'users' }: { db: LoDashExplicitSyncWrapper<any>; collectionName?: string }) => {
  async function getUsersById(ids: string[]): Promise<any[]> {
    const promises = [];
    for (const id of ids) {
      promises.push(getUserById(id));
    }
    return Promise.all(promises);
  }

  function getUserById(id: string): any {
    return db
      .get(collectionName)
      .find({ id })
      .value();
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
