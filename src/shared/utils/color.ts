/**
 * Normaliza uma cor para um valor CSS válido.
 * A API envia o hex sem `#` (ex.: "8340EC"); aqui garantimos o prefixo.
 */
export const toCssHex = (color: string): string =>
  color.startsWith("#") ? color : `#${color}`;
