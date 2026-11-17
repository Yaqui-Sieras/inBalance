// src/constants/routes.ts
import type { RouteConfigItem, NavItem, SocialLink } from '@types-local/routes';
import { buildUrl, getTarget } from '@/utils/url';

export const ROUTES_CONFIG = {
  // --- RUTAS PÚBLICAS ---
  landing: {
    label: 'Inicio',
    path: '/',
    target: '_self',
    icon: '🏯',
    scope: 'public',
    showInNav: true,
  },
  demo: {
    label: 'Demo',
    path: 'demo/',
    target: '_self',
    icon: '🧾',
    scope: 'public',
    showInNav: true,
  },
  githubRepo: {
    label: 'GitHub Repo',
    path: 'https://github.com/yaqui-sieras/inBalance',
    target: '_blank',
    icon: '🐈‍⬛',
    scope: 'public',
    showInNav: true,
  },
  access: {
    label: 'Acceso',
    path: 'acceso/',
    target: '_self',
    icon: '👋',
    scope: 'public',
    showInNav: false,
  },
  privacy: {
    label: 'Privacidad',
    path: 'privacidad/',
    target: '_blank',
    icon: '✉️',
    scope: 'public',
    showInNav: false,
  },
  terms: {
    label: 'Términos y Condiciones',
    path: 'terminos-condiciones/',
    target: '_blank',
    icon: '✉️',
    scope: 'public',
    showInNav: false,
  },
  license: {
    label: 'Licencia MIT',
    path: 'LICENSE/',
    target: '_blank',
    icon: '✉️',
    scope: 'public',
    showInNav: false,
  },
  // --- RUTAS PRIVADAS (/app/) ---
  appDashboard: {
    label: 'Dashboard',
    path: 'app/',
    target: '_self',
    icon: '🏯',
    scope: 'private',
    showInNav: true,
  },
  appAccounts: {
    label: 'Cuentas',
    path: 'app/cuentas/',
    target: '_self',
    icon: '🎭',
    scope: 'private',
    showInNav: true,
  },
  appAccountDetail: {
    label: 'Detalle de Cuenta',
    path: 'app/cuentas/detalle/',
    target: '_self',
    icon: '🔍',
    scope: 'private',
    showInNav: false,
  },
  appTransactions: {
    label: 'Transacciones',
    path: 'app/transacciones/',
    target: '_self',
    icon: '🧮',
    scope: 'private',
    showInNav: true,
  },
  appNewTransaction: {
    label: 'Nueva Transacción',
    path: 'app/transacciones/nueva/',
    target: '_self',
    icon: '➕',
    scope: 'private',
    showInNav: false,
  },
  appReports: {
    label: 'Reportes',
    path: 'app/reportes/',
    target: '_self',
    icon: '📊',
    scope: 'private',
    showInNav: true,
  },
  appSettings: {
    label: 'Configuración',
    path: 'app/configuracion/',
    target: '_self',
    icon: '⚙️',
    scope: 'private',
    showInNav: true,
  },
  // --- REDES Y CONTACTO ---
  gitHubAccount: {
    label: 'Cuenta GitHub',
    path: 'https://github.com/yaqui-sieras',
    target: '_blank',
    icon: '🐈‍⬛',
    scope: 'public',
    showInNav: false,
  },
  linkedin: {
    label: 'LinkedIn',
    path: 'https://linkedin.com/in/yaqui-sieras-vr/',
    target: '_blank',
    icon: '💼',
    scope: 'public',
    showInNav: false,
  },
  email: {
    label: 'Email',
    path: 'mailto:tu-email@ejemplo.com',
    target: '_self',
    icon: '✉️',
    scope: 'public',
    showInNav: false,
  },
} as const satisfies Record<string, RouteConfigItem>;

export type RouteKey = keyof typeof ROUTES_CONFIG;
export type RouteItem = (typeof ROUTES_CONFIG)[RouteKey];

// Generamos el objeto ROUTES plano
// (para hacer redirecciones o links sueltos)
export const ROUTES = Object.fromEntries(
  Object.entries(ROUTES_CONFIG).map(([key, config]) => [
    key.toUpperCase(),
    buildUrl(config.path),
  ]),
) as Record<Uppercase<RouteKey>, string>;

// Helper interno para no repetir el mapeo de NavItem
const toNavItem = (config: RouteConfigItem): NavItem => ({
  label: config.label,
  href: buildUrl(config.path),
  target: config.target,
  icon: config.icon,
});

export const PUBLIC_NAV_ITEMS: readonly NavItem[] = Object.values(ROUTES_CONFIG)
  .filter((config) => config.scope === 'public' && config.showInNav)
  .map(toNavItem);

export const APP_NAV_ITEMS: readonly NavItem[] = Object.values(ROUTES_CONFIG)
  .filter((config) => config.scope === 'private' && config.showInNav)
  .map(toNavItem);

export const LEGAL_LINKS = [
  {
    label: ROUTES_CONFIG.license.label,
    href: buildUrl(ROUTES_CONFIG.license.path),
  },
  {
    label: ROUTES_CONFIG.terms.label,
    href: buildUrl(ROUTES_CONFIG.terms.path),
  },
  {
    label: ROUTES_CONFIG.privacy.label,
    href: buildUrl(ROUTES_CONFIG.privacy.path),
  },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: ROUTES_CONFIG.gitHubAccount.label,
    url: ROUTES_CONFIG.gitHubAccount.path,
    target: getTarget(
      ROUTES_CONFIG.gitHubAccount.path,
      ROUTES_CONFIG.gitHubAccount.target,
    ),
    icon: ROUTES_CONFIG.gitHubAccount.icon,
  },
  {
    name: ROUTES_CONFIG.linkedin.label,
    url: ROUTES_CONFIG.linkedin.path,
    target: getTarget(
      ROUTES_CONFIG.linkedin.path,
      ROUTES_CONFIG.linkedin.target,
    ),
    icon: ROUTES_CONFIG.linkedin.icon,
  },
  {
    name: ROUTES_CONFIG.email.label,
    url: ROUTES_CONFIG.email.path,
    target: getTarget(ROUTES_CONFIG.email.path, ROUTES_CONFIG.email.target),
    icon: ROUTES_CONFIG.email.icon,
  },
] as const;
