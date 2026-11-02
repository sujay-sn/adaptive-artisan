// A minimal IndexedDB key-value store, for things too large for localStorage
// (the wallpaper image).

const DATABASE = 'adaptive-artisan';
const STORE = 'files';

let database: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB is unavailable'));
  });
  return database;
}

async function run<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const request = operation(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

export const idbGet = <T>(key: string) => run<T | undefined>('readonly', (store) => store.get(key) as IDBRequest<T | undefined>);
export const idbSet = (key: string, value: unknown) => run('readwrite', (store) => store.put(value, key)).then(() => undefined);
export const idbDelete = (key: string) => run('readwrite', (store) => store.delete(key)).then(() => undefined);