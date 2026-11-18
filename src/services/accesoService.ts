// @services/accesoService.ts
import type { LedgerManager } from '@lib/LedgerManager.ts';
import { STORAGE_KEYS } from '@constants/storage';
import { hashPassword } from '@utils/crypto';

function createUserAvatar(userName: string): string {
  let avatar: string = '¿?';

  if (userName.length > 0) {
    if (userName.split(' ').length > 1) {
      avatar = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    } else {
      avatar = userName.slice(0, 1).toUpperCase();
    }
  }
  return avatar;
}

/**
 * Crea un nuevo usuario en el sistema local y establece su sesión activa.
 */
export async function createUserAndLogin(
  ledgerEngine: LedgerManager,
  name: string,
  password: string,
): Promise<void> {
  const newUserId = crypto.randomUUID();
  const userName = name.trim();
  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: newUserId,
    name: userName,
    avatar: createUserAvatar(userName),
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await ledgerEngine.saveUser(newUser);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newUserId);
}

/**
 * Establece un usuario existente como la sesión activa en el dispositivo.
 */
export function setActiveUser(userId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
}

/**
 * Verifica la contraseña de un usuario existente y establece su sesión si es correcta.
 */
export async function verifyUserLogin(
  ledgerEngine: LedgerManager,
  userId: string,
  password: string,
): Promise<void> {
  const users = ledgerEngine.getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new Error('El usuario seleccionado no existe.');
  }

  // Hasheamos la contraseña ingresada para compararla con el hash guardado
  const hashedInputPassword = await hashPassword(password);

  if (user.passwordHash !== hashedInputPassword) {
    throw new Error('Contraseña incorrecta.');
  }

  // Si coincide, establecemos la sesión activa
  setActiveUser(userId);
}

/**
 * Restaura un respaldo completo de la base de datos a partir de un archivo JSON.
 */
export async function restoreBackupFromJsonString(
  ledgerEngine: LedgerManager,
  jsonString: string,
): Promise<void> {
  const jsonContent = JSON.parse(jsonString);

  if (!jsonContent?.data?.users) {
    throw new Error('Formato de respaldo inválido.');
  }

  await ledgerEngine.clearAllData();

  const { users, books, book_members, accounts, transactions } =
    jsonContent.data;

  // Ejecución masiva optimizada
  await Promise.all([
    ...(users || []).map((u: any) => ledgerEngine.saveUser(u)),
    ...(books || []).map((b: any) => ledgerEngine.saveBook(b)),
    ...(book_members || []).map((bm: any) => ledgerEngine.saveBookMember(bm)),
    ...(accounts || []).map((acc: any) => ledgerEngine.saveAccount(acc)),
    ...(transactions || []).map((tx: any) => ledgerEngine.saveTransaction(tx)),
  ]);

  const usuariosRestaurados = ledgerEngine.getUsers();
  if (usuariosRestaurados.length > 0) {
    if (usuariosRestaurados[0]) setActiveUser(usuariosRestaurados[0].id);
  }
}
