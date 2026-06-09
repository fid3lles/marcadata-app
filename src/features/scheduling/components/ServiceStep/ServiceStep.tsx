import { useState } from "react";
import { ImageOff } from "lucide-react";
import {
  formatCurrency,
  formatDuration,
  getReadableForeground,
  toCssHex,
} from "../../../../shared/utils";
import type { IProvidedService } from "../../../business";
import type { SelectedService } from "../../types";
import { ServiceDetailSheet } from "../ServiceDetailSheet";

export interface ServiceStepProps {
  /** Serviços prestados pelo estabelecimento. */
  services: IProvidedService[];
  /** Cor do estabelecimento (repassada à bandeja de detalhes). */
  color: string;
  /** Serviços já selecionados (com quantidade). */
  selectedServices: SelectedService[];
  /** Confirma a quantidade de um serviço (insere ou atualiza a seleção). */
  onConfirmService: (service: IProvidedService, quantity: number) => void;
  /** Remove um serviço da seleção. */
  onRemoveService: (serviceId: number) => void;
}

/**
 * Etapa 1 do agendamento: exibe os serviços prestados numa lista rolável.
 * Cada item é um card branco com placeholder de imagem, nome, descrição
 * (limitada a 2 linhas) e o preço (BRL) com a duração. Ao tocar num card,
 * abre a bandeja com os detalhes do serviço — já com a quantidade escolhida,
 * se ele estiver na seleção.
 */
export function ServiceStep({
  services,
  color,
  selectedServices,
  onConfirmService,
  onRemoveService,
}: ServiceStepProps) {
  const hex = toCssHex(color);
  const badgeForeground = getReadableForeground(hex);

  const [selected, setSelected] = useState<IProvidedService | null>(null);
  const [open, setOpen] = useState(false);
  // Muda a cada abertura para remontar o conteúdo da bandeja (quantidade fresca).
  const [openSeq, setOpenSeq] = useState(0);

  const openService = (service: IProvidedService) => {
    setSelected(service);
    setOpen(true);
    setOpenSeq((seq) => seq + 1);
  };

  // Seleção atual do serviço aberto: existe? com qual quantidade?
  const currentSelection = selected
    ? selectedServices.find((item) => item.service.id === selected.id)
    : undefined;
  const isSelected = currentSelection !== undefined;
  const initialQuantity = currentSelection?.quantity ?? 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="text-lg font-bold text-slate-900">Escolha os serviços</h2>

      <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto p-1">
        {services.map((service) => {
          const selectedQuantity = selectedServices.find(
            (item) => item.service.id === service.id,
          )?.quantity;
          const itemSelected = selectedQuantity !== undefined;

          return (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => openService(service)}
                // Selecionado: borda na cor do business (sobrescreve a borda padrão).
                style={itemSelected ? { borderColor: hex } : undefined}
                className="flex w-full gap-3 rounded-xl border-2 border-slate-100 bg-white p-3 text-left shadow-sm transition active:scale-[0.99]"
              >
                {/* Imagem do serviço; sem URL, mostra o ícone de fallback. */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-300">
                  {service.imageHref ? (
                    <img
                      src={service.imageHref}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff className="h-7 w-7" aria-hidden="true" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="font-semibold text-slate-900">
                    {itemSelected && (
                      <span
                        className="mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 align-[2px] text-xs font-bold"
                        style={{
                          backgroundColor: hex,
                          color: badgeForeground,
                        }}
                      >
                        {selectedQuantity}
                      </span>
                    )}
                    {service.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                    {service.description}
                  </p>
                  <p className="mt-auto pt-2 text-sm">
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(service.price)}
                    </span>
                    <span className="text-slate-400">
                      {" · "}
                      {formatDuration(service.duration)}
                    </span>
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <ServiceDetailSheet
        service={selected}
        color={color}
        open={open}
        openSeq={openSeq}
        initialQuantity={initialQuantity}
        isSelected={isSelected}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmService}
        onRemove={onRemoveService}
      />
    </div>
  );
}
