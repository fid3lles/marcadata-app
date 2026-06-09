import { useState } from "react";
import { ChevronDown, ImageOff, Minus, Plus } from "lucide-react";
import { BottomSheet } from "../../../../shared/components";
import {
  formatCurrency,
  formatDuration,
  toCssHex,
} from "../../../../shared/utils";
import type { IProvidedService } from "../../../business";

export interface ServiceDetailSheetProps {
  /** Serviço exibido. `null` mantém a bandeja vazia (fechada). */
  service: IProvidedService | null;
  /** Cor do estabelecimento aplicada aos elementos de ação. */
  color: string;
  /** Controla a abertura da bandeja. */
  open: boolean;
  /** Chamado ao fechar. */
  onClose: () => void;
  /** Chamado ao confirmar a adição do serviço, com a quantidade escolhida. */
  onAdd: (service: IProvidedService, quantity: number) => void;
}

/**
 * Bandeja de detalhes de um serviço, no layout de "produto":
 * imagem (placeholder) com botão de fechar, nome, descrição, preço e
 * uma barra inferior com seletor de quantidade + botão "Adicionar".
 */
export function ServiceDetailSheet({
  service,
  color,
  open,
  onClose,
  onAdd,
}: ServiceDetailSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      {service && (
        // key remonta o conteúdo (zera a quantidade) a cada serviço aberto.
        <ServiceDetailContent
          key={service.id}
          service={service}
          color={color}
          onClose={onClose}
          onAdd={onAdd}
        />
      )}
    </BottomSheet>
  );
}

interface ServiceDetailContentProps {
  service: IProvidedService;
  color: string;
  onClose: () => void;
  onAdd: (service: IProvidedService, quantity: number) => void;
}

function ServiceDetailContent({
  service,
  color,
  onClose,
  onAdd,
}: ServiceDetailContentProps) {
  const hex = toCssHex(color);
  const [quantity, setQuantity] = useState(1);
  const total = service.price * quantity;

  return (
    <>
      {/* Imagem (placeholder) com botão de fechar */}
      <div className="relative flex h-56 shrink-0 items-center justify-center bg-slate-100 text-slate-300">
        <ImageOff className="h-12 w-12" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow"
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h2 className="text-xl font-bold text-slate-900">{service.name}</h2>
        <p className="mt-1 text-slate-500">{service.description}</p>
        <p className="mt-4 text-lg">
          <span className="font-bold text-slate-900">
            {formatCurrency(service.price)}
          </span>
          <span className="text-slate-400">
            {" · "}
            {formatDuration(service.duration)}
          </span>
        </p>
      </div>

      {/* Barra de ação */}
      <div
        className="flex items-center gap-3 border-t border-slate-100 p-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity === 1}
            aria-label="Diminuir quantidade"
            className="disabled:opacity-30"
            style={{ color: hex }}
          >
            <Minus className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="w-5 text-center font-semibold text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Aumentar quantidade"
            style={{ color: hex }}
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onAdd(service, quantity);
            onClose();
          }}
          className="flex flex-1 items-center justify-between rounded-xl px-5 py-3.5 font-semibold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: hex }}
        >
          <span>Adicionar</span>
          <span>{formatCurrency(total)}</span>
        </button>
      </div>
    </>
  );
}
