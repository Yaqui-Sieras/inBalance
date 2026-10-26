// @constants/contabilidadConfig.ts
import type { AccountNature, NatureMetadata } from '@types-local/contabilidad';

// Configuración maestra de todas las naturalezas permitidas en la app
export const ACCOUNT_NATURE_CONFIG: Record<AccountNature, NatureMetadata> = {
  activo: {
    label: 'activo',
    group: 'balance',
    behavior: 'deudora', // Aumenta con Débito
  },
  pasivo: {
    label: 'pasivo',
    group: 'balance',
    behavior: 'acreedora', // Aumenta con Crédito
  },
  patrimonio: {
    label: 'patrimonio',
    group: 'balance',
    behavior: 'acreedora', // Aumenta con Crédito
  },
  ingreso: {
    label: 'ingreso',
    group: 'flujo',
    behavior: 'acreedora', // Aumenta con Crédito
  },
  gasto: {
    label: 'gasto',
    group: 'flujo',
    behavior: 'deudora', // Aumenta con Débito
  },
  costo: {
    label: 'costo',
    group: 'flujo',
    behavior: 'deudora', // Aumenta con Débito
  },
  transitoria: {
    label: 'transitoria',
    group: 'transitoria',
    behavior: 'deudora', // Aumenta con Débito (o neutra operativa)
  },
};
