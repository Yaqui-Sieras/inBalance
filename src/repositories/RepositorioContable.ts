// @repositories/RepositorioContable.ts
import type { Account, Transaction } from '@types-local/contabilidad';

export interface RepositorioContable {
  getAccounts(): Promise<Account[]>;
  saveAccount(account: Account): Promise<void>;

  getTransactions(): Promise<Transaction[]>;
  saveTransaction(transaction: Transaction): Promise<void>;
}
