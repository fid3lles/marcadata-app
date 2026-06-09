import { toCssHex } from "../../utils";

export interface HeaderProps {
  /** Cor do estabelecimento (hex, com ou sem `#`). */
  color: string;
  /** Nome do estabelecimento exibido no cabeçalho. */
  businessName: string;
}

/**
 * Cabeçalho fixo da aplicação. Pintado com a cor do estabelecimento e
 * sempre visível em todas as telas.
 */
export function Header({ color, businessName }: HeaderProps) {
  return (
    <header
      className="rounded-b-[13px] px-5 pb-6 pt-6 text-white"
      style={{ backgroundColor: toCssHex(color) }}
    >
      <p className="text-sm text-white/80">agendando com:</p>
      <p className="mt-0.5 text-xl font-bold tracking-tight">{businessName}</p>
    </header>
  );
}
