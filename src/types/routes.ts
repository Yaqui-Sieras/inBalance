// @types-local/routes.ts

export type a_target = '_self' | '_blank' | '_parent' | '_top' | '_unfencedTop';
export type RouteScope = 'public' | 'private';

export interface RouteConfigItem {
  label: string;
  path: string;
  target: a_target;
  icon: string;
  scope: RouteScope;
  showInNav: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  target: a_target;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  target: a_target;
  icon: string;
}

export interface BuildUrlOptions {
  useAbsolute?: boolean;
  isExternal?: boolean;
}
