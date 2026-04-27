/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web App URL ending in `/exec` (preferred). */
  readonly GOOGLE_APPS_SCRIPT_URL?: string
  /** Maps to `WEBHOOK_SECRET` in Code.gs `doPost` when using JSON POST. */
  readonly GOOGLE_APPS_SCRIPT_SECRET?: string
  /** @deprecated Use GOOGLE_APPS_SCRIPT_URL */
  readonly VITE_APPS_SCRIPT_WEB_APP_URL?: string
  /** @deprecated Use GOOGLE_APPS_SCRIPT_SECRET */
  readonly VITE_WEBHOOK_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
