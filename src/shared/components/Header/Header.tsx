import { useState } from "react";
import type { ReactNode } from "react";
import { MapPinned } from "lucide-react";
import { toCssHex } from "../../utils";
import { BottomSheet } from "../BottomSheet";

export interface HeaderProps {
  /** Cor do estabelecimento (hex, com ou sem `#`). */
  color: string;
  /** Nome do estabelecimento exibido no cabeçalho. */
  businessName: string;
  /**
   * Conteúdo das informações do estabelecimento. Quando informado, exibe o
   * ícone à direita que abre a bottom sheet.
   */
  info?: ReactNode;
}

/**
 * Cabeçalho fixo da aplicação. Pintado com a cor do estabelecimento e
 * sempre visível em todas as telas.
 */
export function Header({ color, businessName, info }: HeaderProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <header
        className="flex items-center justify-between gap-3 rounded-b-[13px] px-5 pb-6 pt-6 text-white"
        style={{ backgroundColor: toCssHex(color) }}
      >
        <div className="min-w-0">
          <p className="text-sm text-white/80">agendando com:</p>
          <p className="mt-0.5 text-xl font-bold tracking-tight">
            {businessName}
          </p>
        </div>

        {info && (
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            aria-label="Informações do estabelecimento"
            className="shrink-0 rounded-full p-2 text-white transition hover:bg-white/10 active:scale-95"
          >
            <MapPinned className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </header>

      {info && (
        <BottomSheet open={infoOpen} onClose={() => setInfoOpen(false)}>
          {info}
        </BottomSheet>
      )}
    </>
  );
}
