// @utils/baseRender.ts
import type { LedgerManager } from '@lib/LedgerManager.ts';
import { motorContable } from '@lib/LedgerManager.ts';

/**
 * Ejecuta una función de renderizado asegurando la carga de datos
 * del motor inyectado y atrapando errores de forma centralizada.
 */
export async function ejecutarRenderSeguro(
  renderFn: (ledgerEngine: LedgerManager) => Promise<void> | void,
  contextoError: string = 'Elemento desconocido',
): Promise<void> {
  try {
    // Asegurar carga de datos utilizando estrictamente la instancia inyectada
    await motorContable.ensureLoaded();

    // Ejecutamos la particularidad de la página
    await renderFn(motorContable);
  } catch (error) {
    console.error(
      `[Error] Fallo en el proceso de renderizado en ${contextoError}:`,
      error,
    );
  }
}
