// @utils/url.ts
import type { BuildUrlOptions, a_target } from '@types-local/routes';

/**
 * Normaliza cualquier ruta o URL garantizando siempre una barra final ('/').
 */
function ensureTrailingSlash(url: string): string {
  if (!url) return '/';
  return url.endsWith('/') ? url : `${url}/`;
}

export const BASE_URL = ensureTrailingSlash(import.meta.env.BASE_URL);
// Dominio raíz en producción (ej. https://yaqui-sieras.github.io/)
// En desarrollo local usa un fallback al dominio base de GitHub Pages.
export const SITE_URL = ensureTrailingSlash(
  import.meta.env.SITE || 'https://yaqui-sieras.github.io/',
);

/**
 * Determina si una URL o ruta dada apunta fuera del dominio de la aplicación.
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;

  try {
    const targetOrigin = new URL(url).origin;
    const siteOrigin = new URL(SITE_URL).origin;
    return targetOrigin !== siteOrigin;
  } catch {
    return false;
  }
}

/**
 * Helper para construir URLs absolutas para repositorios externos o rutas locales de desarrollo.
 * @param path Ruta relativa, ej: "proyectos/"
 * @param useAbsolute Si es true genera la URL completa.
 */
export function buildUrl(path: string, options: BuildUrlOptions = {}): string {
  const { useAbsolute = false } = options;

  if (isExternalUrl(path)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (import.meta.env.DEV && useAbsolute) {
    return `${BASE_URL}#${cleanPath}`;
  }

  const prefix = useAbsolute ? SITE_URL : BASE_URL;

  return `${prefix}${cleanPath}`;
}

// Función para inferir el target si no viene definido
export function getTarget(path: string, target?: a_target): a_target {
  if (target) return target;
  return isExternalUrl(path) ? '_blank' : '_self';
}
