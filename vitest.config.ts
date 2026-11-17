/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig carga astro.config.mjs, así los tests ven el mismo
// `import.meta.env.BASE_URL` y los mismos alias que la aplicación.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
