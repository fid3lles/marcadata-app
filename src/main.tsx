import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Inicia o Mock Service Worker em desenvolvimento (localhost) ou quando a flag
 * VITE_ENABLE_MOCKS está ligada no build (demo do GitHub Pages, sem backend).
 *
 * O import é dinâmico para que o MSW não entre nos builds de produção em que
 * nenhuma das condições é verdadeira (tree-shaking).
 */
async function enableMocking() {
  const shouldMock =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === "true";
  if (!shouldMock) return;

  const { worker } = await import("./core/mocks/browser");
  // `bypass`: requisições sem handler seguem para a rede real (assets, etc.).
  // `serviceWorker.url`: respeita o base do Vite (subpasta no GitHub Pages).
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
