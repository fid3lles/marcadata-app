import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// No GitHub Actions o site é servido em https://<user>.github.io/<repo>/,
// então o base precisa ser "/<repo>/". Derivamos do GITHUB_REPOSITORY
// ("owner/repo") para funcionar sem depender do nome fixo do repositório.
// Localmente (e em outros hosts) o base continua "/".
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS && repository ? `/${repository}/` : "/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
