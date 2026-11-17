// src/env.d.ts
interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly SITE: string | undefined;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
