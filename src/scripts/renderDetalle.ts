// @utils/renderDetalle.ts
import { motorContable } from '@lib/LedgerManager';
import { ejecutarRenderSeguro } from './baseRender';

const MENSAJES = {
  SIN_ESPECIFICAR: 'Cuenta no especificada',
  NO_ENCONTRADA: 'Cuenta no encontrada',
} as const;

export async function renderizarDetalleCuenta(): Promise<void> {
  // Particularidad: manejo de parámetros de URL
  const accountId = getQueryParam('id');
  const elNombre = document.getElementById('nombre_cuenta');
  const elId = document.getElementById('id_cuenta');
  const elSaldo = document.getElementById('saldo_cuenta');

  if (!accountId) {
    if (elNombre) elNombre.textContent = MENSAJES.SIN_ESPECIFICAR;
    return;
  }

  if (elId) elId.textContent = accountId;

  // Delegamos la ejecución segura al envoltorio común
  await ejecutarRenderSeguro(
    async () => {
      const cuenta = motorContable.getAccountById(accountId);

      if (!cuenta) {
        if (elNombre) elNombre.textContent = MENSAJES.NO_ENCONTRADA;
        return;
      }

      if (elNombre) elNombre.textContent = `Detalle de Cuenta: ${cuenta.name}`;
      if (elSaldo) elSaldo.textContent = cuenta.balance.toLocaleString();
    },
    'detalle de cuenta',
    motorContable,
  );
}

function getQueryParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(param);
}
