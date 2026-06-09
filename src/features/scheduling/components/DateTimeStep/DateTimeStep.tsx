import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { IAgenda } from "../../../business";
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

export interface DateTimeStepProps {
  /** Agenda da loja (ocupações, dias fechados, horário de funcionamento). */
  agenda: IAgenda | null;
  /** Indica se a agenda está sendo carregada. */
  loading: boolean;
  /** Indica se houve erro ao carregar a agenda. */
  error: boolean;
  /** Cor do estabelecimento aplicada à seleção. */
  color: string;
  /** Data selecionada ("AAAA-MM-DD") ou null. */
  selectedDate: string | null;
  /** Horário selecionado ("HH:mm") ou null. */
  selectedTime: string | null;
  /** Chamado ao escolher uma data. */
  onSelectDate: (date: string) => void;
  /** Chamado ao escolher um horário. */
  onSelectTime: (time: string) => void;
}

/** Quantos dias o seletor exibe a partir de hoje. */
const VISIBLE_DAYS = 14;

/**
 * Etapa 2 do agendamento: escolha de data e hora.
 *
 * Componente apresentacional — a agenda e a seleção vêm do `SchedulingForm`,
 * que mantém o estado entre as etapas. Para o dia escolhido, exibe os horários
 * livres agrupados por período, descontando os intervalos ocupados.
 */
export function DateTimeStep({
  agenda,
  loading,
  error,
  color,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: DateTimeStepProps) {
  const hex = toCssHex(color);
  const foreground = getReadableForeground(hex);

  const today = useMemo(() => new Date(), []);
  const days = useMemo(
    () => Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(today, i)),
    [today],
  );

  const closedDates = useMemo(
    () => new Set(agenda?.closedDays.map((day) => day.date) ?? []),
    [agenda],
  );

  // Horários livres do dia selecionado, agrupados por período.
  const availability = useMemo(() => {
    if (!agenda || !selectedDate || closedDates.has(selectedDate)) {
      return { manha: [], tarde: [], noite: [] };
    }
    const busyPeriods =
      agenda.busyDays.find((day) => day.date === selectedDate)?.periods ?? [];
    return getAvailableSlots(agenda.openTime, busyPeriods);
  }, [agenda, selectedDate, closedDates]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span>Carregando horários…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-amber-800">
        Não foi possível carregar a agenda.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col animate-fade-in">
      <h2 className="text-lg font-bold text-slate-900">Qual a melhor data?</h2>

      {/* Seletor de datas (scroll horizontal). */}
      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {days.map((day) => {
          const iso = toISODate(day);
          const isClosed = closedDates.has(iso);
          const isActive = iso === selectedDate;
          const dayNumber = String(day.getDate()).padStart(2, "0");
          const monthNumber = String(day.getMonth() + 1).padStart(2, "0");

          return (
            <button
              key={iso}
              type="button"
              disabled={isClosed}
              onClick={() => onSelectDate(iso)}
              style={isActive ? { backgroundColor: hex, color: foreground } : undefined}
              className={`flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 py-3.5 transition ${
                isActive
                  ? "border-transparent"
                  : isClosed
                    ? "border-slate-100 text-slate-300"
                    : "border-slate-200 text-slate-900"
              }`}
            >
              <span
                className="text-xs"
                style={isActive || isClosed ? undefined : { color: hex }}
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

      {/* Horários por período (scroll vertical). */}
      <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pb-2">
        {PERIOD_ORDER.map((period) => {
          const slots = availability[period];
          return (
            <section key={period}>
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
                            ? { backgroundColor: hex, color: foreground }
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
