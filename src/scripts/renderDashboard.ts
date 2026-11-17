// @utils/renderDashboard.ts
import { motorContable } from '@lib/LedgerManager';
import { ejecutarRenderSeguro } from './baseRender';

export async function renderizarDashboard(): Promise<void> {
  await ejecutarRenderSeguro(
    async () => {
      const { totalDebit, totalCredit, imbalance } =
        motorContable.getTrialBalance();

      const elDebit = document.getElementById('kpi_debit');
      const elCredit = document.getElementById('kpi_credit');
      const elImbalance = document.getElementById('kpi_imbalance');

      if (elDebit) elDebit.textContent = `$${totalDebit.toFixed(2)}`;
      if (elCredit) elCredit.textContent = `$${totalCredit.toFixed(2)}`;
      if (elImbalance) elImbalance.textContent = `$${imbalance.toFixed(2)}`;
    },
    'dashboard',
    motorContable,
  );
}
