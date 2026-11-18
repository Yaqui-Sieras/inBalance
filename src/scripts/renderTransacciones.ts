// @utils/renderTransacciones.ts
import { motorContable } from '@lib/LedgerManager';
import { ejecutarRenderSeguro } from './baseRender';

export async function renderizarLibroDiario(): Promise<void> {
  await ejecutarRenderSeguro(async () => {
    const cuentas = motorContable.getAccounts();
    const transacciones = motorContable.getTransactions();
    const { totalDebit, totalCredit, imbalance } =
      motorContable.getTrialBalance();

    const tbody = document.getElementById('libro_diario_asientos');
    const elTotalDebit = document.getElementById('total_debit');
    const elTotalCredit = document.getElementById('total_credit');
    const elImbalance = document.getElementById('total_imbalance');

    if (!tbody) return;

    if (transacciones.length === 0) {
      tbody.innerHTML = `
        <tr class="body__fila">
          <td colspan="3" class="body__column">
            <p class="body__empty">No hay transacciones registradas.</p>
          </td>
        </tr>
      `;
      if (elTotalDebit) elTotalDebit.textContent = '-';
      if (elTotalCredit) elTotalCredit.textContent = '-';
      if (elImbalance) elImbalance.textContent = '-';
      return;
    }

    let html = '';

    for (const tx of transacciones) {
      html += `
        <tbody class="asiento" style="background: #111827; display: table-row-group;">
          <tr>
            <th colspan="3" class="asiento__glosa" style="font-size: 0.85rem; font-style: italic; color: #d1d5db; background: #1f2937; padding: 0.25rem 0.75rem;">
              <div style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                <span><strong>Resumen:</strong> ${tx.description}</span>
                <span style="color: #6b7280;">${tx.date}</span>
              </div>
            </th>
          </tr>
      `;

      for (const line of tx.lines) {
        const account = cuentas.find((a) => a.id === line.accountId);
        const accountName = account ? account.name : line.accountId;

        html += `
          <tr class="asiento__fila" style="border-bottom: solid 1px #1f2937;">
            <td class="asiento__column" style="padding: 0.5rem 1.5rem; border-right: 1px solid #374151; text-align: left; color: #f3f4f6;">
              ${accountName}
            </td>
            <td class="asiento__column asiento__column_amounts" style="padding: 0.5rem 1.5rem; border-right: 1px solid #374151; text-align: right; font-family: monospace; font-weight: 600;">
              ${line.direction === 'debito' ? `$${line.amount.toFixed(2)}` : '<span style="color: #6b7280;">-</span>'}
            </td>
            <td class="asiento__column asiento__column_amounts" style="padding: 0.5rem 1.5rem; text-align: right; font-family: monospace; font-weight: 600;">
              ${line.direction === 'credito' ? `$${line.amount.toFixed(2)}` : '<span style="color: #6b7280;">-</span>'}
            </td>
          </tr>
        `;
      }

      html += `</tbody>`;
    }

    tbody.innerHTML = html;

    if (elTotalDebit) elTotalDebit.textContent = `$${totalDebit.toFixed(2)}`;
    if (elTotalCredit) elTotalCredit.textContent = `$${totalCredit.toFixed(2)}`;
    if (elImbalance) elImbalance.textContent = `$${imbalance.toFixed(2)}`;
  }, 'libro diario');
}
