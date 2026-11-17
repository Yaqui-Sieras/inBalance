// @repositories/RepositorioContable.ts
import type { Account, Transaction } from '@types-local/contabilidad';

export interface RepositorioContable {
  // Usuarios
  getUsers(): Promise<any[]>;
  saveUser(user: any): Promise<void>;

  // Libros Contables
  getBooks(): Promise<any[]>;
  saveBook(book: any): Promise<void>;

  // Miembros de Libros
  getBookMembers(): Promise<any[]>;
  saveBookMember(member: any): Promise<void>;

  // Cuentas y Transacciones (Filtradas o generales)
  getAccounts(): Promise<Account[]>;
  saveAccount(account: Account): Promise<void>;

  getTransactions(): Promise<Transaction[]>;
  saveTransaction(transaction: Transaction): Promise<void>;

  clearAllData(): Promise<void>;
}
