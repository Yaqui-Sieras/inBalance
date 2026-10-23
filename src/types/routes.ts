// @types-local/routes.ts

export type a_target = '_self' | '_blank' | '_parent' | '_top' | '_unfencedTop';

export type RouteConfigItem = {
  label: string;
  path: string;
  icon?: string;
  target?: a_target;
  showInNav: boolean;
};

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
