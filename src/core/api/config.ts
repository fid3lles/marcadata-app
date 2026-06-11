/**
 * Context path do servidor. Todas as rotas da API são montadas a partir daqui.
 *
 * - Local/dev: usa o caminho relativo, que é interceptado pelo MSW.
 * - Build (ex.: GitHub Pages): defina `VITE_API_BASE_PATH` com a URL completa
 *   do backend, incluindo o context path —
 *   ex.: "https://seu-app.up.railway.app/api".
 */
export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || "/api";
