import { Loader2 } from "lucide-react";
import { getReadableForeground, toCssHex } from "../../../../shared/utils";
import type { IBusinessProfessionals } from "../../../business";

export interface ProfessionalCarouselProps {
  /** Profissionais (disponíveis/indisponíveis). */
  data: IBusinessProfessionals | null;
  /** Indica se os profissionais estão sendo carregados. */
  loading: boolean;
  /** Indica se houve erro ao carregar. */
  error: boolean;
  /** Cor do estabelecimento aplicada à seleção. */
  color: string;
  /** Id do profissional selecionado, ou null. */
  selectedProfessionalId: number | null;
  /** Chamado ao escolher um profissional. */
  onSelect: (id: number) => void;
}

/** Iniciais do primeiro e do último nome, usadas quando não há foto. */
const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
};

/**
 * Carrossel (scroll horizontal) de profissionais: foto, nome e especialidade.
 * Indisponíveis aparecem desabilitados. Componente embutível (sem título nem
 * altura cheia) — o título da seção fica a cargo de quem o usa.
 */
export function ProfessionalCarousel({
  data,
  loading,
  error,
  color,
  selectedProfessionalId,
  onSelect,
}: ProfessionalCarouselProps) {
  const hex = toCssHex(color);
  const foreground = getReadableForeground(hex);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span>Carregando profissionais…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-amber-800">
        Não foi possível carregar os profissionais.
      </div>
    );
  }

  const cards = [
    ...(data?.professionals.available ?? []).map((professional) => ({
      professional,
      available: true,
    })),
    ...(data?.professionals.unavailable ?? []).map((professional) => ({
      professional,
      available: false,
    })),
  ];

  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 animate-fade-in">
      {cards.map(({ professional, available }) => {
        const selected = professional.id === selectedProfessionalId;

        return (
          <button
            key={professional.id}
            type="button"
            disabled={!available}
            onClick={() => onSelect(professional.id)}
            style={selected ? { backgroundColor: hex } : undefined}
            className={`flex h-56.25 w-45 shrink-0 flex-col items-center justify-center rounded-2xl border-2 p-4 text-center shadow-sm transition ${
              selected ? "border-transparent" : "border-slate-100"
            } ${available ? "active:scale-[0.98]" : "opacity-50"}`}
          >
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100">
              {professional.imgHref ? (
                <img
                  src={professional.imgHref}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-slate-400">
                  {initialsOf(professional.name)}
                </span>
              )}
            </div>

            <p
              className="mt-3 font-bold"
              style={{ color: selected ? foreground : hex }}
            >
              {professional.name}
            </p>
            <p
              className={`text-sm ${selected ? "" : "text-slate-500"}`}
              style={selected ? { color: foreground } : undefined}
            >
              {professional.expertise}
            </p>
          </button>
        );
      })}
    </div>
  );
}
