// @repositories/MemoryRepository.ts
import type { RepositorioContable } from '@repositories/RepositorioContable';
import type { Account, Transaction } from '@types-local/contabilidad';

export class MemoryRepository implements RepositorioContable {
  private accounts: Account[] = [];
  private transactions: Transaction[] = [];

  async getAccounts(): Promise<Account[]> {
    return this.accounts;
  }

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactions;
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }
}
