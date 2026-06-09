import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Inicia o Mock Service Worker apenas em desenvolvimento (localhost).
 * O import é dinâmico para que o MSW não entre no bundle de produção.
 */
async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import("./core/mocks/browser");
  // `bypass`: requisições sem handler seguem para a rede real (assets, etc.).
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
