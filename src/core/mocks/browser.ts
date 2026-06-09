import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * Worker MSW para o navegador.
 *
 * Mocka as requisições da API enquanto a aplicação roda em localhost (dev).
 * A inicialização acontece em `src/main.tsx`, condicionada a `import.meta.env.DEV`,
 * de modo que nada disto vai para o build de produção.
 *
 * O service worker em `public/mockServiceWorker.js` foi gerado via:
 *   npx msw init public/ --save
 */
export const worker = setupWorker(...handlers);
