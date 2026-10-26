// @lib/ledgerManager.ts
import type { RepositorioContable } from '@repositories/RepositorioContable';
import { MemoryRepository } from '@repositories/MemoryRepository';
import type { Account, Transaction } from '@types-local/contabilidad';

class LedgerManager {
  private repo: RepositorioContable;
  private accounts: Map<string, Account> = new Map();
  private transactions: Transaction[] = [];

  constructor(repo: RepositorioContable = new MemoryRepository()) {
    this.repo = repo;
  }

  // Carga inicial de datos desde el repositorio
  async load(): Promise<void> {
    const cuentasList = await this.repo.getAccounts();
    const transaccionesList = await this.repo.getTransactions();

    this.accounts.clear();
    for (const cuenta of cuentasList) {
      this.accounts.set(cuenta.id, cuenta);
    }

    this.transactions = [...transaccionesList];
    this.recalculateAndSaveBalances();
  }

  // Agregar una cuenta nueva al sistema
  async addAccount(
    accountData: Omit<Account, 'id' | 'balance'>,
  ): Promise<string> {
    const { name, nature } = accountData;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('El nombre de la cuenta es obligatorio.');
    }
    if (!nature || !nature.label || !nature.group || !nature.behavior) {
      throw new Error('La naturaleza contable de la cuenta es inválida.');
    }

    const id = crypto.randomUUID();

    const newAccount: Account = {
      id,
      name: name.trim(),
      nature,
      balance: 0,
    };

    this.accounts.set(id, newAccount);
    await this.repo.saveAccount(newAccount);
    return id;
  }

  // Registrar un asiento contable validando la partida doble
  async addTransaction(txData: Omit<Transaction, 'id'>): Promise<boolean> {
    const { date, description, lines } = txData;

    if (!date || !description || typeof description !== 'string') {
      throw new Error(
        'La fecha y la descripción de la transacción son obligatorias.',
      );
    }

    if (!lines || !Array.isArray(lines) || lines.length < 2) {
      throw new Error(
        'Un asiento contable debe tener al menos dos líneas (partida doble).',
      );
    }

    let totalDebitos = 0;
    let totalCreditos = 0;

    for (const line of lines) {
      if (!this.accounts.has(line.accountId)) {
        throw new Error(
          `La cuenta con ID "${line.accountId}" no existe en el sistema.`,
        );
      }

      if (typeof line.amount !== 'number' || line.amount <= 0) {
        throw new Error(
          'El monto de cada línea debe ser un número positivo mayor a cero.',
        );
      }

      if (line.direction !== 'debito' && line.direction !== 'credito') {
        throw new Error(
          'La dirección del movimiento debe ser estrictamente "debito" o "credito".',
        );
      }

      if (line.direction === 'debito') {
        totalDebitos += line.amount;
      } else {
        totalCreditos += line.amount;
      }
    }

    if (Math.abs(totalDebitos - totalCreditos) > 0.001) {
      throw new Error(
        `Asiento desbalanceado. Los débitos (${totalDebitos}) deben ser iguales a los créditos (${totalCreditos}).`,
      );
    }

    const id = crypto.randomUUID();
    const newTransaction: Transaction = {
      id,
      date,
      description: description.trim(),
      lines,
    };

    this.transactions.push(newTransaction);
    await this.repo.saveTransaction(newTransaction);

    await this.recalculateAndSaveBalances();
    return true;
  }

  // Recálculo inteligente y guardado en el repositorio
  private async recalculateAndSaveBalances(): Promise<void> {
    for (const account of this.accounts.values()) {
      account.balance = 0;
    }

    for (const tx of this.transactions) {
      for (const line of tx.lines) {
        const account = this.accounts.get(line.accountId);
        if (!account) continue;

        const esNaturalezaAcreedora = account.nature.behavior === 'acreedora';

        if (line.direction === 'debito') {
          account.balance += esNaturalezaAcreedora ? -line.amount : line.amount;
        } else {
          account.balance += esNaturalezaAcreedora ? line.amount : -line.amount;
        }
      }
    }

    // Guardamos cada cuenta actualizada en el repositorio para mantener la persistencia real
    for (const account of this.accounts.values()) {
      await this.repo.saveAccount(account);
    }
  }

  // Obtener todas las cuentas protegiendo el estado interno
  getAccounts(): Account[] {
    return Array.from(this.accounts.values());
  }

  // Obtener el historial de transacciones protegiendo el estado interno
  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  // Obtener los totales generales del libro diario
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
        } else {
          totalCredit += line.amount;
        }
      }
    }

    return {
      totalDebit,
      totalCredit,
      imbalance: totalDebit - totalCredit,
    };
  }
}

export const motorContable = new LedgerManager();
