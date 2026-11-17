// @lib/authGuard.ts
import { motorContable } from '@lib/LedgerManager';
import { STORAGE_KEYS } from '@constants/storage';
import { ROUTES } from '@constants/routes';

/**
 * Intercepta la navegación para verificar el estado de autenticación local.
 * - Si no hay usuarios o sesión activa, redirige a la vista de bienvenida/perfiles.
 * - Si ya hay sesión y el usuario intenta entrar a bienvenida, lo redirige al Dashboard.
 */
export async function checkAuthOrRedirect(currentPath: string): Promise<void> {
  // 1. Aseguramos que el motor cargue los datos desde IndexedDB
  await motorContable.ensureLoaded();

  const usuarios = motorContable.getUsers();
  const activeUserId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);

  // Verificamos si la ruta actual corresponde a la página de bienvenida/perfiles
  const isWelcomePage = currentPath.includes(ROUTES.ACCESS);

  // CASO 1: No hay usuarios registrados en el dispositivo
  if (usuarios.length === 0) {
    if (!isWelcomePage) {
      window.location.href = ROUTES.ACCESS;
    }
    return;
  }

  // CASO 2: Hay usuarios, pero no se ha seleccionado una sesión activa
  if (!activeUserId) {
    if (!isWelcomePage) {
      window.location.href = ROUTES.ACCESS;
    }
    return;
  }

  // CASO 3: Hay sesión activa, pero el usuario intenta entrar a la página de bienvenida/login por error
  if (isWelcomePage && activeUserId) {
    window.location.href = ROUTES.APPDASHBOARD;
  }
}
