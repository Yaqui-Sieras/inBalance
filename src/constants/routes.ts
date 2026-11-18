// src/constants/routes.ts
import type { RouteConfigItem, NavItem, SocialLink } from '@types-local/routes';
import { buildUrl, getTarget } from '@/utils/url';

export const ROUTES_CONFIG = {
  // --- RUTAS PÚBLICAS ---
  landing: {
    label: 'Inicio',
    path: buildUrl('/'),
    target: '_self',
    icon: '🏯',
    scope: 'public',
    showInNav: true,
  },
  demo: {
    label: 'Demo',
    path: buildUrl('demo/'),
    target: '_self',
    icon: '📓',
    scope: 'public',
    showInNav: true,
  },
  githubRepo: {
    label: 'GitHub Repo',
    path: buildUrl('https://github.com/yaqui-sieras/inBalance'),
    target: '_blank',
    icon: '🐈‍⬛',
    scope: 'public',
    showInNav: true,
  },
  access: {
    label: 'Acceso',
    path: buildUrl('acceso/'),
    target: '_self',
    icon: '🛎️',
    scope: 'public',
    showInNav: false,
  },
  createUser: {
    label: 'Crear Usuario',
    path: buildUrl('acceso/crear-usuario/'),
    target: '_self',
    icon: '🫆',
    scope: 'public',
    showInNav: false,
  },
  loginUser: {
    label: 'Iniciar Sesion',
    path: buildUrl('acceso/iniciar-sesion/'),
    target: '_self',
    icon: '🔐',
    scope: 'public',
    showInNav: false,
  },
  privacy: {
    label: 'Privacidad',
    path: buildUrl('privacidad/'),
    target: '_blank',
    icon: '🔏',
    scope: 'public',
    showInNav: false,
  },
  terms: {
    label: 'Términos y Condiciones',
    path: buildUrl('terminos-condiciones/'),
    target: '_blank',
    icon: '⚖️',
    scope: 'public',
    showInNav: false,
  },
  license: {
    label: 'Licencia MIT',
    path: buildUrl('LICENSE/'),
    target: '_blank',
    icon: '📃',
    scope: 'public',
    showInNav: false,
  },
  // --- RUTAS PRIVADAS (/app/) ---
  appDashboard: {
    label: 'Dashboard',
    path: buildUrl('app/'),
    target: '_self',
    icon: '🏯',
    scope: 'private',
    showInNav: true,
  },
  appAccounts: {
    label: 'Cuentas',
    path: buildUrl('app/cuentas/'),
    target: '_self',
    icon: '🎭',
    scope: 'private',
    showInNav: true,
  },
  appAccountDetail: {
    label: 'Detalle de Cuenta',
    path: buildUrl('app/cuentas/detalle/'),
    target: '_self',
    icon: '🔍',
    scope: 'private',
    showInNav: false,
  },
  appTransactions: {
    label: 'Transacciones',
    path: buildUrl('app/transacciones/'),
    target: '_self',
    icon: '🧮',
    scope: 'private',
    showInNav: true,
  },
  appNewTransaction: {
    label: 'Nueva Transacción',
    path: buildUrl('app/transacciones/nueva/'),
    target: '_self',
    icon: '➕',
    scope: 'private',
    showInNav: false,
  },
  appReports: {
    label: 'Reportes',
    path: buildUrl('app/reportes/'),
    target: '_self',
    icon: '📊',
    scope: 'private',
    showInNav: true,
  },
  appSettings: {
    label: 'Configuración',
    path: buildUrl('app/configuracion/'),
    target: '_self',
    icon: '⚙️',
    scope: 'private',
    showInNav: true,
  },
  // --- REDES Y CONTACTO ---
  gitHubAccount: {
    label: 'Cuenta GitHub',
    path: buildUrl('https://github.com/yaqui-sieras'),
    target: '_blank',
    icon: '🐈‍⬛',
    scope: 'public',
    showInNav: false,
  },
  linkedin: {
    label: 'LinkedIn',
    path: buildUrl('https://linkedin.com/in/yaqui-sieras-vr/'),
    target: '_blank',
    icon: '💼',
    scope: 'public',
    showInNav: false,
  },
  email: {
    label: 'Email',
    path: buildUrl('mailto:tu-email@ejemplo.com'),
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
    config.path,
  ]),
) as Record<Uppercase<RouteKey>, string>;

// Helper interno para no repetir el mapeo de NavItem
const toNavItem = (config: RouteConfigItem): NavItem => ({
  label: config.label,
  href: config.path,
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
    href: ROUTES_CONFIG.license.path,
  },
  {
    label: ROUTES_CONFIG.terms.label,
    href: ROUTES_CONFIG.terms.path,
  },
  {
    label: ROUTES_CONFIG.privacy.label,
    href: ROUTES_CONFIG.privacy.path,
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
