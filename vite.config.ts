import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// No GitHub Actions o site é servido em https://<user>.github.io/<repo>/,
// então o base precisa ser "/<repo>/". Derivamos do GITHUB_REPOSITORY
// ("owner/repo") para funcionar sem depender do nome fixo do repositório.
// Localmente (e em outros hosts) o base continua "/".
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS && repository ? `/${repository}/` : "/";

/**
 * Gera um 404.html como cópia do index.html após o build. Hosts estáticos
 * como o GitHub Pages servem o 404.html para qualquer caminho desconhecido,
 * permitindo que o app (e o React Router) carregue e resolva a rota — inclusive
 * em links diretos / refresh de subrotas.
 */
function spaFallback(): Plugin {
  let outDir = "dist";
  return {
    name: "spa-404-fallback",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const index = resolve(outDir, "index.html");
      if (existsSync(index)) {
        copyFileSync(index, resolve(outDir, "404.html"));
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), spaFallback()],
});
