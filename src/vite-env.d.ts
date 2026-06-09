/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Quando "true", habilita o MSW também no build de produção
   * (usado para publicar a demo no GitHub Pages). Definido pelo workflow.
   */
  readonly VITE_ENABLE_MOCKS?: string;
}
