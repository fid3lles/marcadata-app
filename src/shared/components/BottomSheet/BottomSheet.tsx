import { useEffect } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface BottomSheetProps {
  /** Controla a abertura da bandeja. */
  open: boolean;
  /** Chamado ao fechar (clique no backdrop ou tecla Esc). */
  onClose: () => void;
  /** Conteúdo exibido dentro da bandeja. */
  children: ReactNode;
}

/**
 * Bandeja que desliza de baixo para cima, sobre um backdrop que escurece a
 * tela toda. Reutilizável: controlada por `open`/`onClose`. Centralizada no
 * mesmo `max-w-md` do app e ancorada na base do viewport. Fecha no clique do
 * backdrop ou na tecla Esc.
 */
export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  // Fecha ao pressionar Esc enquanto estiver aberta.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop — escurece a tela toda e fecha ao ser clicado. */}
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 h-full w-full cursor-default bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Painel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[90svh] max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Botão de fechar — presente em toda bandeja. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow"
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>

        {children}
      </div>
    </div>
  );
}
