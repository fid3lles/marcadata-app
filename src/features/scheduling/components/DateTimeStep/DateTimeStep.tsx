import { useMemo } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import type {
  IBusinessProfessionals,
  IProfessionalAgenda,
} from "../../../business";
import {
  addDays,
  getReadableForeground,
  getWeekdayShort,
  toCssHex,
  toISODate,
} from "../../../../shared/utils";
import {
  getAvailableSlots,
  PERIOD_LABELS,
  PERIOD_ORDER,
} from "../../availability";
import { ProfessionalCarousel } from "../ProfessionalCarousel";

export interface DateTimeStepProps {
  /** Cor do estabelecimento aplicada à seleção. */
  color: string;

  /** Data selecionada ("AAAA-MM-DD") ou null. */
  selectedDate: string | null;
  /** Chamado ao escolher uma data. */
  onSelectDate: (date: string) => void;

  /** Profissionais da loja. */
  professionals: IBusinessProfessionals | null;
  professionalsLoading: boolean;
  professionalsError: boolean;
  /** Profissional selecionado, ou null. */
  selectedProfessionalId: number | null;
  onSelectProfessional: (id: number) => void;
  /** Limpa a seleção do profissional (volta ao carrossel). */
  onClearProfessional: () => void;

  /** Agenda do profissional para a data selecionada (ou null). */
  professionalAgenda: IProfessionalAgenda | null;
  agendaLoading: boolean;
  agendaError: boolean;
  /** Horário selecionado ("HH:mm") ou null. */
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

/** Quantos dias o seletor exibe a partir de hoje. */
const VISIBLE_DAYS = 14;

/** Iniciais do primeiro e do último nome, usadas quando não há foto. */
const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
};

/**
 * Etapa 2: data → profissional → horário.
 *
 * Após escolher a data, surge o carrossel de profissionais. Escolhido o
 * profissional, mostra os horários livres (de 30 em 30 min) da agenda dele
 * naquele dia. A data permanece no topo para referência.
 */
export function DateTimeStep({
  color,
  selectedDate,
  onSelectDate,
  professionals,
  professionalsLoading,
  professionalsError,
  selectedProfessionalId,
  onSelectProfessional,
  onClearProfessional,
  professionalAgenda,
  agendaLoading,
  agendaError,
  selectedTime,
  onSelectTime,
}: DateTimeStepProps) {
  const hex = toCssHex(color);
  const foreground = getReadableForeground(hex);

  const today = useMemo(() => new Date(), []);
  const days = useMemo(
    () => Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(today, i)),
    [today],
  );

  // Profissional selecionado (encontrado na lista) para o card compacto.
  const selectedProfessional = useMemo(() => {
    if (selectedProfessionalId === null || !professionals) return null;
    return (
      [
        ...professionals.professionals.available,
        ...professionals.professionals.unavailable,
      ].find((p) => p.id === selectedProfessionalId) ?? null
    );
  }, [selectedProfessionalId, professionals]);

  // Horários livres (30 em 30) da agenda do profissional, agrupados por período.
  const availability = useMemo(
    () =>
      professionalAgenda
        ? getAvailableSlots(
            professionalAgenda.businessHours,
            professionalAgenda.busy,
          )
        : { manha: [], tarde: [], noite: [] },
    [professionalAgenda],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="shrink-0 text-lg font-bold text-slate-900">
        Qual a melhor data?
      </h2>

      {/* Seletor de datas (scroll horizontal) — fixo no topo. */}
      <div className="-mx-1 mt-4 flex shrink-0 gap-2 overflow-x-auto px-1 pb-2">
        {days.map((day) => {
          const iso = toISODate(day);
          const isActive = iso === selectedDate;
          const dayNumber = String(day.getDate()).padStart(2, "0");
          const monthNumber = String(day.getMonth() + 1).padStart(2, "0");

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              style={
                isActive ? { backgroundColor: hex, color: foreground } : undefined
              }
              className={`flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 py-3.5 transition ${
                isActive ? "border-transparent" : "border-slate-200 text-slate-900"
              }`}
            >
              <span
                className="text-xs"
                style={isActive ? undefined : { color: hex }}
              >
                {getWeekdayShort(day)}
              </span>
              <span className="inline-flex items-start leading-none">
                <span className="text-lg font-bold">{dayNumber}/</span>
                <span className="ml-0.5 mt-0.5 text-xs font-semibold">
                  {monthNumber}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo abaixo rola verticalmente. */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {selectedDate && (
          <section className="mt-4 animate-fade-in">
            <h3 className="font-bold text-slate-900">Quem vai te atender?</h3>
            <div className="mt-3">
              {selectedProfessional ? (
                // Card compacto do profissional escolhido (libera espaço p/ horários).
                <button
                  type="button"
                  onClick={onClearProfessional}
                  style={{ backgroundColor: hex, color: foreground }}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition active:scale-[0.99]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                    {selectedProfessional.imgHref ? (
                      <img
                        src={selectedProfessional.imgHref}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: hex }}
                      >
                        {initialsOf(selectedProfessional.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {selectedProfessional.name}
                    </p>
                    <p className="truncate text-sm opacity-80">
                      {selectedProfessional.expertise}
                    </p>
                  </div>

                  <span className="flex shrink-0 items-center gap-0.5 text-sm font-semibold">
                    Escolher outro
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              ) : (
                <ProfessionalCarousel
                  data={professionals}
                  loading={professionalsLoading}
                  error={professionalsError}
                  color={color}
                  selectedProfessionalId={selectedProfessionalId}
                  onSelect={onSelectProfessional}
                />
              )}
            </div>
          </section>
        )}

        {selectedProfessionalId !== null && (
          <section className="mt-6 animate-fade-in">
            {agendaLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                <span>Carregando horários…</span>
              </div>
            ) : agendaError ? (
              <p className="py-8 text-center text-sm text-amber-800">
                Não foi possível carregar a agenda.
              </p>
            ) : professionalAgenda ? (
              <div className="space-y-5">
                {PERIOD_ORDER.map((period) => {
                  const slots = availability[period];
                  return (
                    <div key={period}>
                      <h3 className="font-bold text-slate-900">
                        {PERIOD_LABELS[period]}
                      </h3>

                      {slots.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {slots.map((time) => {
                            const isActive = time === selectedTime;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => onSelectTime(time)}
                                style={
                                  isActive
                                    ? {
                                        backgroundColor: hex,
                                        color: foreground,
                                      }
                                    : undefined
                                }
                                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                                  isActive
                                    ? "border-transparent"
                                    : "border-slate-200 text-slate-700"
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-2 text-center text-sm text-slate-400">
                          Não há horários disponíveis :(
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>
        )}
      </div>
    </div>
  );
}
