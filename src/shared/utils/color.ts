/**
 * Normaliza uma cor para um valor CSS válido.
 * A API envia o hex sem `#` (ex.: "8340EC"); aqui garantimos o prefixo.
 */
export const toCssHex = (color: string): string =>
  color.startsWith("#") ? color : `#${color}`;

/** Converte um hex (com ou sem `#`, 3 ou 6 dígitos) em canais RGB 0-255. */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((channel) => channel + channel)
      .join("");
  }
  const int = parseInt(value, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
};

/** Luminância relativa (WCAG) de um canal sRGB 0-255. */
const channelLuminance = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/**
 * Decide a cor de primeiro plano (preto ou branco) com melhor contraste
 * sobre o fundo informado, usando a luminância relativa (WCAG).
 *
 * @example
 * getReadableForeground("#8340EC") // "#ffffff" (fundo escuro)
 * getReadableForeground("#fce303") // "#000000" (fundo claro)
 */
export const getReadableForeground = (
  backgroundHex: string,
): "#000000" | "#ffffff" => {
  const { r, g, b } = hexToRgb(backgroundHex);
  const luminance =
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b);
  // Acima de ~0.179 o fundo é claro o suficiente para o preto contrastar melhor.
  return luminance > 0.179 ? "#000000" : "#ffffff";
};
