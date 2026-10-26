// @lib/inicializadorTest.ts
import { motorContable } from '@lib/LedgerManager';
import {
  CUENTAS_INICIALES_TEST,
  TRANSACCIONES_INICIALES_TEST,
} from '@data/datosTest';

export async function cargarDatosDePrueba() {
  console.log('🌱 Creando cuentas iniciales...');

  // Diccionario temporal para relacionar el ID estático con el real
  const accountIdMap: Record<string, string> = {};

  // Creamos todas las cuentas y llenamos el mapa
  for (const accountData of CUENTAS_INICIALES_TEST) {
    const realId = await motorContable.addAccount(accountData);
    accountIdMap[accountData.id] = realId; // Ej: { caja: 'uuid-1234...' }
  }

  console.log('✅ Cuentas creadas con éxito.');
  console.log('📊 Registrando transacciones de prueba...');

  // Registramos las transacciones traduciendo los IDs al vuelo con .map()
  for (const tx of TRANSACCIONES_INICIALES_TEST) {
    await motorContable.addTransaction({
      date: tx.date,
      description: tx.description,
      lines: tx.lines.map((line) => ({
        // Reemplazamos el ID estático por el real usando el diccionario
        accountId: accountIdMap[line.accountId],
        direction: line.direction,
        amount: line.amount,
      })),
    });
  }

  console.log('🚀 ¡Datos de prueba cargados y validados correctamente!');
}
