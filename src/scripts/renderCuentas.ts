// @utils/renderCuentas.ts
import { motorContable } from '@lib/LedgerManager';
import { ROUTES } from '@constants/routes';
import { ejecutarRenderSeguro } from './baseRender';

const NATURALEZAS_CONTABLES = [
  'ingreso',
  'activo',
  'pasivo',
  'patrimonio',
  'transitoria',
  'gasto',
  'costo',
] as const;

export async function renderizarPlanDeCuentas(): Promise<void> {
  await ejecutarRenderSeguro(async () => {
    const cuentas = motorContable.getAccounts();

    for (const nat of NATURALEZAS_CONTABLES) {
      const tbody = document.getElementById(`cuentas_${nat}`);
      const totalEl = document.getElementById(`total_${nat}`);
      if (!tbody) continue;

      const items = cuentas.filter(
        (acc) => acc.nature.group === nat || acc.nature.label === nat,
      );

      if (items.length === 0) {
        tbody.innerHTML = getEmptyRowTemplate();
        if (totalEl) totalEl.textContent = formatCurrency(0);
        continue;
      }

      let html = '';
      let subtotal = 0;

      for (const cuenta of items) {
        const esAcreedora = cuenta.nature.behavior === 'acreedora';
        subtotal += cuenta.balance;
        const detalleUrl = `${ROUTES.APPACCOUNTS}detalle?id=${cuenta.id}`;

        html += `
          <tr class="cuenta__fila">
            <td class="cuenta__column">
              <a href="${detalleUrl}" style="color: #e5e7eb; text-decoration: none; font-weight: 500;">
                ${cuenta.name}
              </a>
            </td>
            <td class="cuenta__column cuenta__amount">
              ${!esAcreedora ? formatCurrency(cuenta.balance) : '-'}
            </td>
            <td class="cuenta__column cuenta__amount">
              ${esAcreedora ? formatCurrency(cuenta.balance) : '-'}
            </td>
          </tr>
        `;
      }

      tbody.innerHTML = html;
      if (totalEl) totalEl.textContent = formatCurrency(subtotal);
    }
  }, 'plan de cuentas');
}

function getEmptyRowTemplate(): string {
  return `
    <tr>
      <td colspan="3" class="cuenta__column empty-section cuenta__label" style="text-align: center;">
        Sin cuentas
      </td>
    </tr>`;
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
