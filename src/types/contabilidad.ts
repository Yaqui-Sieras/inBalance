// @types/contabilidad.ts

// ==== TIPOS BASE (Uniones y Primitivos) =================================================

// Clasificación general de las cuentas (Familias principales)
export type AccountGroup = 'balance' | 'flujo' | 'transitoria';

// Naturaleza económica (Define su comportamiento contable)
export type AccountNature =
  | 'activo'
  | 'pasivo'
  | 'patrimonio'
  | 'ingreso'
  | 'gasto'
  | 'costo'
  | 'transitoria';

export type NatureBehavior = 'deudora' | 'acreedora';

// Especificamos si el movimiento es al Debe (debito) o al Haber (credito)
export type EntryDirection = 'debito' | 'credito';

// ==== INTERFACES DEL DOMINIO CONTABLE ===================================================

export interface NatureMetadata {
  label: AccountNature;
  group: AccountGroup;
  behavior: NatureBehavior;
}

// La estructura de una Cuenta
export interface Account {
  id: string;
  name: string;
  nature: NatureMetadata;
  balance: number;
}

// Una línea individual dentro de una transacción (afecta a una cuenta con un monto)
export interface TransactionLine {
  accountId: string;
  direction: EntryDirection;
  amount: number;
}

// La Transacción completa (o Asiento contable)
export interface Transaction {
  id: string; // Identificador único del asiento
  date: string; // Fecha de la transacción (Formato "YYYY-MM-DD")
  description: string; // Concepto o motivo (ej: "Compra de supermercado")
  lines: TransactionLine[]; // Las líneas que, sumadas, deben dar 0
}
