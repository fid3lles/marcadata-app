import { useEffect } from "react";
import type { ReactNode } from "react";

export interface BottomSheetProps {
  /** Controla a abertura da bandeja. */
  open: boolean;
  /** Chamado ao fechar (clique no backdrop ou tecla Esc). */
  onClose: () => void;
  /** Conteúdo exibido dentro da bandeja. */
  children: ReactNode;
}

/**
 * Bandeja que desliza de baixo para cima, sobre um backdrop escurecido.
 * Reutilizável: controlada por `open`/`onClose`. Centralizada no mesmo
 * `max-w-md` do app e ancorada na base do viewport.
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
      {/* Backdrop */}
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
        {children}
      </div>
    </div>
  );
}
