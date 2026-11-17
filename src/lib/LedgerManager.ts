// @lib/LedgerManager.ts
import { IndexedDBRepository } from '@/repositories/IndexedDbRepository';
import type { RepositorioContable } from '@repositories/RepositorioContable';
import type { Account, Transaction } from '@types-local/contabilidad';

export class LedgerManager {
  private repository: RepositorioContable;
  private loaded: boolean = false;

  // Estados en memoria
  private users: any[] = [];
  private books: any[] = [];
  private bookMembers: any[] = [];
  private accounts: Account[] = [];
  private transactions: Transaction[] = [];

  constructor(repository: RepositorioContable = new IndexedDBRepository()) {
    this.repository = repository;
  }

  /**
   * Carga inicial de todos los datos desde IndexedDB a la memoria del motor
   */
  async ensureLoaded(): Promise<void> {
    if (this.loaded) return;

    try {
      this.users = await this.repository.getUsers();
      this.books = await this.repository.getBooks();
      this.bookMembers = await this.repository.getBookMembers();
      this.accounts = await this.repository.getAccounts();
      this.transactions = await this.repository.getTransactions();

      this.loaded = true;
      console.log(
        '[LedgerManager] Datos cargados correctamente desde IndexedDB.',
      );
    } catch (error) {
      console.error('[LedgerManager] Error al cargar los datos:', error);
      throw error;
    }
  }

  // --- GETTERS ---
  getUsers(): any[] {
    return this.users;
  }

  getBooks(): any[] {
    return this.books;
  }

  getBookMembers(): any[] {
    return this.bookMembers;
  }

  getAccounts(): Account[] {
    return this.accounts;
  }

  /**
   * Busca y retorna una cuenta específica según su ID único.
   */
  getAccountById(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id);
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  /**
   * Calcula el balance de comprobación (Trial Balance) sumando
   * todos los débitos y créditos del libro diario.
   */
  getTrialBalance(): {
    totalDebit: number;
    totalCredit: number;
    imbalance: number;
  } {
    let totalDebit = 0;
    let totalCredit = 0;

    for (const tx of this.transactions) {
      for (const line of tx.lines) {
        if (line.direction === 'debito') {
          totalDebit += line.amount;
        } else if (line.direction === 'credito') {
          totalCredit += line.amount;
        }
      }
    }

    const imbalance = Number((totalDebit - totalCredit).toFixed(2));

    return {
      totalDebit: Number(totalDebit.toFixed(2)),
      totalCredit: Number(totalCredit.toFixed(2)),
      imbalance,
    };
  }

  // --- MÉTODOS DE GUARDADO ---
  async saveUser(user: any): Promise<void> {
    await this.repository.saveUser(user);
    this.users = await this.repository.getUsers();
  }

  async saveBook(book: any): Promise<void> {
    await this.repository.saveBook(book);
    this.books = await this.repository.getBooks();
  }

  async saveBookMember(member: any): Promise<void> {
    await this.repository.saveBookMember(member);
    this.bookMembers = await this.repository.getBookMembers();
  }

  async saveAccount(account: Account): Promise<void> {
    await this.repository.saveAccount(account);
    this.accounts = await this.repository.getAccounts();
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.repository.saveTransaction(transaction);
    this.transactions = await this.repository.getTransactions();
  }

  // --- LIMPIEZA TOTAL ---
  async clearAllData(): Promise<void> {
    await this.repository.clearAllData();
    this.users = [];
    this.books = [];
    this.bookMembers = [];
    this.accounts = [];
    this.transactions = [];
    this.loaded = false;
    console.log(
      '[LedgerManager] Memoria y base de datos reseteadas por completo.',
    );
  }
}

// Instancia global exportada del motor
export const motorContable = new LedgerManager();
