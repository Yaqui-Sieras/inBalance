// src/constants/routest.ts
import type { RouteConfigItem, NavItem, SocialLink } from '@types-local/routes';
import { buildUrl, getTarget } from '@/utils/url';

export const ROUTES_CONFIG: Record<string, RouteConfigItem> = {
  home: {
    label: 'Inicio',
    path: '/',
    icon: '🏯',
    showInNav: true,
  },
  accounts: {
    label: 'Cuentas',
    path: 'cuentas/',
    icon: '🎭',
    showInNav: true,
  },
  transactions: {
    label: 'Transacciones',
    path: 'transacciones/',
    icon: '🧮',
    showInNav: true,
  },
  demo: {
    label: 'Demo',
    path: 'demo/',
    icon: '🧾',
    showInNav: true,
  },
  githubRepo: {
    label: 'GitHub Repo',
    path: 'https://github.com/yaqui-sieras/inBalance',
    target: '_blank',
    icon: '🐈‍⬛',
    showInNav: true,
  },
  // Rutas que solo existen como URLs pero NO van en el menú de navegación principal
  gitHubAccount: {
    label: 'Cuenta GitHub',
    path: 'https://github.com/yaqui-sieras',
    target: '_blank',
    showInNav: false,
  },
  linkedin: {
    label: 'LinkedIn',
    path: 'https://linkedin.com/in/yaqui-sieras-vr/',
    target: '_blank',
    showInNav: false,
  },
  email: {
    label: 'Email',
    path: 'mailto:tu-email@ejemplo.com',
    target: '_self',
    showInNav: false,
  },
  privacy: {
    label: 'Privacidad',
    path: 'privacidad/',
    showInNav: false,
  },
  terms: {
    label: 'Términos y Condiciones',
    path: 'terminos-condiciones/',
    showInNav: false,
  },
  license: {
    label: 'Licencia MIT',
    path: 'LICENSE',
    showInNav: false,
  },
} as const;

// Generamos el objeto ROUTES plano
// (para hacer redirecciones o links sueltos)
export const ROUTES = Object.fromEntries(
  Object.entries(ROUTES_CONFIG).map(([key, config]) => [
    key.toUpperCase(),
    buildUrl(config.path),
  ]),
) as Record<keyof typeof ROUTES_CONFIG, string>;

// NAV_ITEMS filtrando los que tengan `showInNav: true`
export const NAV_ITEMS: readonly NavItem[] = Object.values(ROUTES_CONFIG)
  .filter((config) => config.showInNav)
  .map((config) => ({
    label: config.label,
    href: buildUrl(config.path),
    target: getTarget(config.path, config.target),
    icon: config.icon ?? '',
  }));

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
    icon: ROUTES_CONFIG.gitHubAccount.icon ?? '',
  },
  {
    name: ROUTES_CONFIG.linkedin.label,
    url: ROUTES_CONFIG.linkedin.path,
    target: getTarget(
      ROUTES_CONFIG.linkedin.path,
      ROUTES_CONFIG.linkedin.target,
    ),
    icon: ROUTES_CONFIG.linkedin.icon ?? '',
  },
  {
    name: ROUTES_CONFIG.email.label,
    url: ROUTES_CONFIG.email.path,
    target: getTarget(ROUTES_CONFIG.email.path, ROUTES_CONFIG.email.target),
    icon: ROUTES_CONFIG.email.icon ?? '',
  },
] as const;
