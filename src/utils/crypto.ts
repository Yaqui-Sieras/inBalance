// @utils/crypto.ts

/**
 * Hashea un texto plano (como una contraseña) utilizando SHA-256 y devuelve su representación en hexadecimal.
 */
export async function hashPassword(password: string): Promise<string> {
  // 1. Convertir la contraseña a un array de bytes (Uint8Array) usando TextEncoder
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // 2. Aplicar el algoritmo de hash SHA-256 mediante la Web Crypto API nativa
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 3. Convertir el ArrayBuffer resultante a una cadena hexadecimal legible
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}
