// @utils/url.ts
import type { BuildUrlOptions, a_target } from '@types-local/routes';

const withTrailingSlash = (value: string) =>
  value.endsWith('/') ? value : `${value}/`;

/** Agrega '/' final a las rutas de página, sin tocar archivos, query ni hash. */
function withPageSlash(path: string): string {
  const [, pathname = '', suffix = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  const lastSegment = pathname.split('/').pop() ?? '';
  const needsSlash =
    pathname !== '' &&
    !pathname.endsWith('/') &&
    !/\.[a-z0-9]+$/i.test(lastSegment);
  return `${pathname}${needsSlash ? '/' : ''}${suffix}`;
}

export const BASE_URL = withTrailingSlash(import.meta.env.BASE_URL || '/');
const SITE_URL: string | undefined = import.meta.env.SITE; // undefined en local sin plataforma
export const SITE_ORIGIN = SITE_URL ? new URL(SITE_URL).origin : undefined;

/**
 * Determina si una URL o ruta dada apunta fuera del dominio de la aplicación.
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  if (!/^(https?:)?\/\//.test(url)) return false;

  try {
    // Sin SITE (local), toda URL absoluta se considera externa
    const targetOrigin = new URL(url, 'https://placeholder.invalid').origin;
    return targetOrigin !== SITE_ORIGIN;
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
  if (path.startsWith('#')) return path;

  const { useAbsolute = false } = options;
  if (isExternalUrl(path)) return path;

  const relative = `${BASE_URL}${withPageSlash(path.replace(/^\//, ''))}`;

  // Sin `site` no se puede armar una URL absoluta; se devuelve la relativa
  return useAbsolute && SITE_ORIGIN ? `${SITE_ORIGIN}${relative}` : relative;
}

// Función para inferir el target si no viene definido
export function getTarget(path: string, target?: a_target): a_target {
  if (target) return target;
  if (/^(mailto|tel):/.test(path)) return '_self';
  return isExternalUrl(path) ? '_blank' : '_self';
}
