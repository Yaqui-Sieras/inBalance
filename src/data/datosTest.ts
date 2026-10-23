// @data/datosTest.ts
import type { Account, Transaction } from '@types-local/contabilidad';

export const CUENTAS_INICIALES_TEST: Omit<Account, 'balance'>[] = [
  // --- CUENTAS DE BALANCE (Estáticas) ---
  {
    id: 'caja',
    name: 'Efectivo en Billetera',
    nature: {
      label: 'activo',
      group: 'balance',
      behavior: 'deudora',
    },
  },
  {
    id: 'billetera_virtual',
    name: 'Cuenta Mercado pago',
    nature: {
      label: 'activo',
      group: 'balance',
      behavior: 'deudora',
    },
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta de Crédito',
    nature: {
      label: 'pasivo',
      group: 'balance',
      behavior: 'acreedora',
    },
  },
  {
    id: 'capital',
    name: 'Patrimonio / Capital Inicial',
    nature: {
      label: 'patrimonio',
      group: 'balance',
      behavior: 'acreedora',
    },
  },

  // --- CUENTAS DE FLUJO (Dinámicas) ---
  {
    id: 'sueldo',
    name: 'Ingresos por Sueldo',
    nature: {
      label: 'ingreso',
      group: 'flujo',
      behavior: 'acreedora',
    },
  },
  {
    id: 'super',
    name: 'Gastos de Supermercado',
    nature: {
      label: 'gasto',
      group: 'flujo',
      behavior: 'deudora',
    },
  },
  {
    id: 'costo_insumos',
    name: 'Costos de Insumos / Producción',
    nature: {
      label: 'costo',
      group: 'flujo',
      behavior: 'deudora',
    },
  },

  // --- CUENTAS TRANSITORIAS (Técnicas) ---
  {
    id: 'transitoria',
    name: 'Transferencias en Tránsito',
    nature: {
      label: 'transitoria',
      group: 'transitoria',
      behavior: 'deudora',
    },
  },
];

export const TRANSACCIONES_INICIALES_TEST: Omit<Transaction, 'id'>[] = [
  {
    date: '2026-10-01',
    description: 'Capital inicial de la persona',
    lines: [
      { accountId: 'caja', direction: 'debito', amount: 500 },
      { accountId: 'billetera_virtual', direction: 'debito', amount: 2000 },
      { accountId: 'capital', direction: 'credito', amount: 2500 },
    ],
  },
  {
    date: '2026-10-05',
    description: 'Cobro de sueldo mensual',
    lines: [
      { accountId: 'billetera_virtual', direction: 'debito', amount: 1500 },
      { accountId: 'sueldo', direction: 'credito', amount: 1500 },
    ],
  },
  {
    date: '2026-10-10',
    description: 'Compra de víveres en el supermercado con tarjeta',
    lines: [
      { accountId: 'super', direction: 'debito', amount: 200 },
      { accountId: 'tarjeta', direction: 'credito', amount: 200 },
    ],
  },
  {
    date: '2026-10-12',
    description: 'Compra de insumos directos pagados en efectivo',
    lines: [
      { accountId: 'costo_insumos', direction: 'debito', amount: 150 },
      { accountId: 'caja', direction: 'credito', amount: 150 },
    ],
  },
];
