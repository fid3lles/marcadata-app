import { toCssHex } from "../../utils";

export interface FooterProps {
  /** Cor do estabelecimento (hex, com ou sem `#`). */
  color: string;
}

/**
 * Rodapé fixo da aplicação. Usa a cor do estabelecimento e fica
 * sempre visível em todas as telas.
 */
export function Footer({ color }: FooterProps) {
  return (
    <footer
      className="px-5 py-4 text-center text-sm text-white"
      style={{ backgroundColor: toCssHex(color) }}
    >
      Made with <span aria-label="amor">🤍</span> by{" "}
      <span className="font-bold">Marcadata</span>
    </footer>
  );
}
