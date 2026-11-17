// @repositories/IndexedDBRepository.ts
import type { RepositorioContable } from '@repositories/RepositorioContable';
import type { Account, Transaction } from '@types-local/contabilidad';

const DB_NAME = 'inbalance_db';
const DB_VERSION = 1;

// 👈 Definimos todas las tablas / object stores
const STORE_USERS = 'users';
const STORE_BOOKS = 'books';
const STORE_BOOK_MEMBERS = 'book_members';
const STORE_ACCOUNTS = 'accounts';
const STORE_TRANSACTIONS = 'transactions';

export class IndexedDBRepository implements RepositorioContable {
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        return reject(
          new Error('IndexedDB solo está disponible en el navegador.'),
        );
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      // 👈 Aquí IndexedDB crea las tablas si no existen o si subió la versión
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_USERS)) {
          db.createObjectStore(STORE_USERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_BOOKS)) {
          db.createObjectStore(STORE_BOOKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_BOOK_MEMBERS)) {
          db.createObjectStore(STORE_BOOK_MEMBERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
          db.createObjectStore(STORE_ACCOUNTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
          db.createObjectStore(STORE_TRANSACTIONS, { keyPath: 'id' });
        }
      };
    });
  }

  // --- MÉTODOS DE USUARIOS ---
  async getUsers(): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_USERS, 'readonly');
      const store = transaction.objectStore(STORE_USERS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUser(user: any): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_USERS, 'readwrite');
      const store = transaction.objectStore(STORE_USERS);
      const request = store.put(user);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- MÉTODOS DE LIBROS CONTABLES ---
  async getBooks(): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_BOOKS, 'readonly');
      const store = transaction.objectStore(STORE_BOOKS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveBook(book: any): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_BOOKS, 'readwrite');
      const store = transaction.objectStore(STORE_BOOKS);
      const request = store.put(book);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- MÉTODOS DE MIEMBROS DE LIBROS ---
  async getBookMembers(): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_BOOK_MEMBERS, 'readonly');
      const store = transaction.objectStore(STORE_BOOK_MEMBERS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveBookMember(member: any): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_BOOK_MEMBERS, 'readwrite');
      const store = transaction.objectStore(STORE_BOOK_MEMBERS);
      const request = store.put(member);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- MÉTODOS DE CUENTAS ---
  async getAccounts(): Promise<Account[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ACCOUNTS, 'readonly');
      const store = transaction.objectStore(STORE_ACCOUNTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAccount(account: Account): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ACCOUNTS, 'readwrite');
      const store = transaction.objectStore(STORE_ACCOUNTS);
      const request = store.put(account);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- MÉTODOS DE TRANSACCIONES ---
  async getTransactions(): Promise<Transaction[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_TRANSACTIONS, 'readonly');
      const store = transaction.objectStore(STORE_TRANSACTIONS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTransaction(transactionData: Transaction): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_TRANSACTIONS, 'readwrite');
      const store = transaction.objectStore(STORE_TRANSACTIONS);
      const request = store.put(transactionData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- LIMPIEZA GLOBAL ---
  async clearAllData(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      console.log(
        '[IndexedDB] Iniciando borrado completo de todas las tablas...',
      );
      try {
        const tx = db.transaction(
          [
            STORE_USERS,
            STORE_BOOKS,
            STORE_BOOK_MEMBERS,
            STORE_ACCOUNTS,
            STORE_TRANSACTIONS,
          ],
          'readwrite',
        );

        tx.objectStore(STORE_USERS).clear();
        tx.objectStore(STORE_BOOKS).clear();
        tx.objectStore(STORE_BOOK_MEMBERS).clear();
        tx.objectStore(STORE_ACCOUNTS).clear();
        tx.objectStore(STORE_TRANSACTIONS).clear();

        tx.oncomplete = () => {
          console.log(
            '[IndexedDB] Todas las tablas fueron vaciadas con éxito.',
          );
          resolve();
        };

        tx.onerror = () => {
          console.error('[IndexedDB] Error al vaciar las tablas:', tx.error);
          reject(tx.error);
        };

        tx.onabort = () => {
          console.warn(
            '[IndexedDB] La transacción de borrado global fue abortada.',
          );
          reject(new Error('Transacción abortada'));
        };
      } catch (err) {
        console.error('[IndexedDB] Excepción al limpiar datos:', err);
        reject(err);
      }
    });
  }
}
