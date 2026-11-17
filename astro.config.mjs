// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const env = process.env;

/**
 * Un detector por plataforma. Devuelve { site, base } si está activa, o null si no.
 * Para soportar otra plataforma, se agrega un detector a la lista.
 */
const detectors = [
  // GitHub Pages
  () => {
    if (env.GITHUB_ACTIONS !== 'true' || !env.GITHUB_REPOSITORY) return null;
    const [owner, repo] = env.GITHUB_REPOSITORY.split('/');
    if (!owner || !repo) return null;
    const isUserPage =
      repo.toLowerCase() === `${owner}.github.io`.toLowerCase();
    return {
      site: `https://${owner.toLowerCase()}.github.io`,
      base: isUserPage ? '/' : `/${repo}/`,
    };
  },

  // Vercel
  () =>
    env.VERCEL === '1' && env.VERCEL_PROJECT_PRODUCTION_URL
      ? { site: `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`, base: '/' }
      : null,

  // Netlify
  () =>
    env.NETLIFY === 'true' && env.URL ? { site: env.URL, base: '/' } : null,

  // Cloudflare Pages
  () =>
    env.CF_PAGES === '1' && env.CF_PAGES_URL
      ? { site: env.CF_PAGES_URL, base: '/' }
      : null,
];

const detected = detectors.map((detect) => detect()).find(Boolean);

// Prioridad: variables manuales > plataforma detectada > valores locales
const site = env.SITE_URL ?? detected?.site; // undefined en local
const base = env.BASE_PATH ?? detected?.base ?? '/';

// https://astro.build/config
export default defineConfig({
  // URL absoluta dinámica según el proveedor de hosting
  site: site,

  // Ruta base adaptativa para GitHub Pages o raíz del dominio
  base: base,

  trailingSlash: 'always',
  // El sitemap necesita `site`; en un build local sin plataforma se omite.
  integrations: site ? [sitemap()] : [],
});
