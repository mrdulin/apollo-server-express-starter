import { LoDashExplicitSyncWrapper } from 'lowdb';

const Book = ({ db, collectionName = 'books' }: { db: LoDashExplicitSyncWrapper<any>; collectionName?: string }) => {
  function getAll() {
    return db.get(collectionName).value();
  }

  return { getAll };
};

export { Book };
