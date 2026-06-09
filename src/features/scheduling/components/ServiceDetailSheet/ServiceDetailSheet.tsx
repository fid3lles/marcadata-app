import { useState } from "react";
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react";
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
  /** Muda a cada abertura, forçando a remontagem do conteúdo. */
  openSeq: number;
  /** Quantidade inicial do seletor (a já selecionada, ou 1). */
  initialQuantity: number;
  /** Se o serviço já faz parte da seleção (habilita a remoção via lixeira). */
  isSelected: boolean;
  /** Chamado ao fechar. */
  onClose: () => void;
  /** Confirma a quantidade escolhida para o serviço. */
  onConfirm: (service: IProvidedService, quantity: number) => void;
  /** Remove o serviço da seleção. */
  onRemove: (serviceId: number) => void;
}

/**
 * Bandeja de detalhes de um serviço, no layout de "produto":
 * imagem (placeholder) com botão de fechar, nome, descrição, preço e
 * uma barra inferior com seletor de quantidade + botão "Adicionar".
 *
 * O seletor abre com a quantidade já escolhida (se houver). Ao chegar em 1,
 * o botão de diminuir vira uma lixeira que remove o serviço da seleção.
 */
export function ServiceDetailSheet({
  service,
  color,
  open,
  openSeq,
  initialQuantity,
  isSelected,
  onClose,
  onConfirm,
  onRemove,
}: ServiceDetailSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      {service && (
        // key remonta o conteúdo a cada abertura, reiniciando a quantidade.
        <ServiceDetailContent
          key={openSeq}
          service={service}
          color={color}
          initialQuantity={initialQuantity}
          isSelected={isSelected}
          onClose={onClose}
          onConfirm={onConfirm}
          onRemove={onRemove}
        />
      )}
    </BottomSheet>
  );
}

interface ServiceDetailContentProps {
  service: IProvidedService;
  color: string;
  initialQuantity: number;
  isSelected: boolean;
  onClose: () => void;
  onConfirm: (service: IProvidedService, quantity: number) => void;
  onRemove: (serviceId: number) => void;
}

function ServiceDetailContent({
  service,
  color,
  initialQuantity,
  isSelected,
  onClose,
  onConfirm,
  onRemove,
}: ServiceDetailContentProps) {
  const hex = toCssHex(color);
  const [quantity, setQuantity] = useState(initialQuantity);
  const total = service.price * quantity;
  const atMinimum = quantity === 1;

  // A lixeira só aparece se o serviço já estiver selecionado e a quantidade
  // estiver em 1; aí remove da seleção. Caso contrário, é o "diminuir" comum.
  const showTrash = isSelected && atMinimum;

  const handleDecrement = () => {
    if (showTrash) {
      onRemove(service.id);
      onClose();
      return;
    }
    setQuantity((current) => Math.max(1, current - 1));
  };

  return (
    <>
      {/* Imagem do serviço; sem URL, mostra o ícone. (Fechar vem da BottomSheet.) */}
      <div className="flex h-56 shrink-0 items-center justify-center overflow-hidden bg-slate-100 text-slate-300">
        {service.imageHref ? (
          <img
            src={service.imageHref}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff className="h-12 w-12" aria-hidden="true" />
        )}
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
            onClick={handleDecrement}
            disabled={!showTrash && atMinimum}
            aria-label={showTrash ? "Remover serviço" : "Diminuir quantidade"}
            className="disabled:opacity-30"
            style={{ color: hex }}
          >
            {showTrash ? (
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Minus className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <span className="w-5 text-center font-semibold text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            aria-label="Aumentar quantidade"
            style={{ color: hex }}
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onConfirm(service, quantity);
            onClose();
          }}
          className="flex flex-1 items-center justify-between rounded-xl px-5 py-3.5 font-semibold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: hex }}
        >
          <span>{isSelected ? "Atualizar" : "Adicionar"}</span>
          <span>{formatCurrency(total)}</span>
        </button>
      </div>
    </>
  );
}
