import { useState } from "react";
import { ImageOff } from "lucide-react";
import { formatCurrency, formatDuration } from "../../../../shared/utils";
import type { IProvidedService } from "../../../business";
import { ServiceDetailSheet } from "../ServiceDetailSheet";

export interface ServiceStepProps {
  /** Serviços prestados pelo estabelecimento. */
  services: IProvidedService[];
  /** Cor do estabelecimento (repassada à bandeja de detalhes). */
  color: string;
  /** Chamado ao confirmar a adição de um serviço na bandeja. */
  onAddService: (service: IProvidedService, quantity: number) => void;
}

/**
 * Etapa 1 do agendamento: exibe os serviços prestados numa lista rolável.
 * Cada item é um card branco com placeholder de imagem, nome, descrição
 * (limitada a 2 linhas) e o preço (BRL) com a duração. Ao tocar num card,
 * abre a bandeja com os detalhes do serviço.
 */
export function ServiceStep({
  services,
  color,
  onAddService,
}: ServiceStepProps) {
  const [selected, setSelected] = useState<IProvidedService | null>(null);
  const [open, setOpen] = useState(false);

  const openService = (service: IProvidedService) => {
    setSelected(service);
    setOpen(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="text-lg font-bold text-slate-900">Escolha os serviços</h2>

      <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {services.map((service) => (
          <li key={service.id}>
            <button
              type="button"
              onClick={() => openService(service)}
              className="flex w-full gap-3 rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition active:scale-[0.99]"
            >
              {/* Placeholder de imagem (a API ainda não retorna a URL). */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                <ImageOff className="h-7 w-7" aria-hidden="true" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="font-semibold text-slate-900">{service.name}</p>
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
        ))}
      </ul>

      <ServiceDetailSheet
        service={selected}
        color={color}
        open={open}
        onClose={() => setOpen(false)}
        onAdd={onAddService}
      />
    </div>
  );
}
