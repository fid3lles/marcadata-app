import type { TransitionEvent } from "react";
import { getReadableForeground, toCssHex } from "../../utils";

/** Logo servido a partir de `public/`. Respeita o base do Vite (GitHub Pages). */
const LOGO_SRC = `${import.meta.env.BASE_URL}marcadata_logo.svg`;

export interface LoadingProps {
  /**
   * Cor do estabelecimento, usada na animação de revelação. Enquanto `null`,
   * o fundo é branco e o logo é preto (estado inicial de carregamento). Ao
   * receber a cor, o fundo anima até ela e o logo assume preto ou branco
   * conforme o contraste.
   */
  revealColor?: string | null;
  /** Chamado quando a animação de revelação (troca do fundo) termina. */
  onRevealComplete?: () => void;
  /** Largura/altura da logo em pixels. */
  logoSize?: number;
  /** Texto acessível anunciado por leitores de tela. */
  label?: string;
}

/**
 * Overlay de carregamento reutilizável.
 *
 * Fluxo: abre com fundo branco e logo preto pulsando. Quando `revealColor`
 * é informado, o fundo anima para essa cor (e o logo troca para a cor de
 * melhor contraste); ao fim da animação, `onRevealComplete` é disparado para
 * que o pai possa removê-lo.
 */
export function Loading({
  revealColor = null,
  onRevealComplete,
  logoSize = 96,
  label = "Carregando…",
}: LoadingProps) {
  const revealing = revealColor != null;
  const backgroundColor = revealing ? toCssHex(revealColor) : "#ffffff";

  // Preto durante o carregamento; ao revelar, preto/branco conforme o contraste.
  const logoIsWhite =
    revealing && getReadableForeground(backgroundColor) === "#ffffff";
  const logoFilter = logoIsWhite ? "brightness(0) invert(1)" : "brightness(0)";

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    // Só reage ao fim da transição do fundo do próprio overlay
    // (ignora transições que borbulham de filhos, como o filtro do logo).
    if (
      event.target === event.currentTarget &&
      event.propertyName === "background-color"
    ) {
      onRevealComplete?.();
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      onTransitionEnd={handleTransitionEnd}
      className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1500 ease-out"
      style={{ backgroundColor }}
    >
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        width={logoSize}
        height={logoSize}
        className="animate-pulse-soft select-none"
        style={{
          width: logoSize,
          height: logoSize,
          filter: logoFilter,
          transition: "filter 800ms ease-out",
        }}
        draggable={false}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
