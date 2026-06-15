import { getReadableForeground, toCssHex } from "../../../../shared/utils";
import type { IProfessional } from "../../../business";

export interface ProfessionalCarouselProps {
  /** Profissionais da loja. */
  professionals: IProfessional[];
  /** Cor do estabelecimento aplicada à seleção. */
  color: string;
  /** Id do profissional selecionado, ou null. */
  selectedProfessionalId: number | null;
  /** Chamado ao escolher um profissional. */
  onSelect: (id: number) => void;
}

/** Iniciais do primeiro e do último nome, usadas quando não há foto. */
const initialsOf = (firstname: string, lastname: string): string =>
  `${firstname[0] ?? ""}${lastname[0] ?? ""}`.toUpperCase();

/**
 * Carrossel (scroll horizontal) de profissionais: foto, nome e especialidade.
 * Componente embutível (sem título nem altura cheia) — o título da seção fica
 * a cargo de quem o usa.
 */
export function ProfessionalCarousel({
  professionals,
  color,
  selectedProfessionalId,
  onSelect,
}: ProfessionalCarouselProps) {
  const hex = toCssHex(color);
  const foreground = getReadableForeground(hex);

  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 animate-fade-in">
      {professionals.map((professional) => {
        const selected = professional.id === selectedProfessionalId;

        return (
          <button
            key={professional.id}
            type="button"
            onClick={() => onSelect(professional.id)}
            style={selected ? { backgroundColor: hex } : undefined}
            className={`flex h-56.25 w-45 shrink-0 flex-col items-center justify-center rounded-2xl border-2 p-4 text-center shadow-sm transition active:scale-[0.98] ${
              selected ? "border-transparent" : "border-slate-100"
            }`}
          >
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100">
              {professional.imageHref ? (
                <img
                  src={professional.imageHref}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-slate-400">
                  {initialsOf(professional.firstname, professional.lastname)}
                </span>
              )}
            </div>

            <p
              className="mt-3 font-bold"
              style={{ color: selected ? foreground : hex }}
            >
              {professional.firstname} {professional.lastname}
            </p>
            <p
              className={`text-sm ${selected ? "" : "text-slate-500"}`}
              style={selected ? { color: foreground } : undefined}
            >
              {professional.specialty}
            </p>
          </button>
        );
      })}
    </div>
  );
}
