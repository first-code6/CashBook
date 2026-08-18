/**
 * 统一读取 Vite 环境变量。
 * 在项目根目录的 .env / .env.[mode] / .env.local 中管理。
 * 只有 VITE_ 前缀会暴露给前端。
 * VITE_APP_VERSION 由 vite.config.js 从 package.json 注入，无需写进 .env。
 */
export const env = {
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',
  updateManifestUrl: (import.meta.env.VITE_UPDATE_MANIFEST_URL || '').trim(),
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
