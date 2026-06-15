import type { ITimeRange } from "../business";

/** Períodos do dia. */
export type DayPeriod = "manha" | "tarde" | "noite";

/** Rótulos exibidos para cada período. */
export const PERIOD_LABELS: Record<DayPeriod, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

/** Ordem em que os períodos são exibidos. */
export const PERIOD_ORDER: DayPeriod[] = ["manha", "tarde", "noite"];

/** Horários livres agrupados por período. */
export type AvailabilityByPeriod = Record<DayPeriod, string[]>;

/** Duração de cada slot exibido (em minutos). */
const SLOT_MINUTES = 30;

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const periodOf = (time: string): DayPeriod => {
  const minutes = toMinutes(time);
  if (minutes < 12 * 60) return "manha";
  if (minutes < 18 * 60) return "tarde";
  return "noite";
};

/** Gera horários de `step` em `step` minutos, com o slot inteiro dentro da janela. */
const generateSlots = (
  businessHours: ITimeRange,
  stepMinutes: number,
): string[] => {
  const start = toMinutes(businessHours.start);
  const end = toMinutes(businessHours.end);
  const slots: string[] = [];
  for (let minutes = start; minutes + stepMinutes <= end; minutes += stepMinutes) {
    slots.push(toTime(minutes));
  }
  return slots;
};

/** Verdadeiro se o slot [início, início+duração) colide com algum intervalo ocupado. */
const overlapsBusy = (
  slotStart: string,
  durationMinutes: number,
  busy: ITimeRange[],
): boolean => {
  const start = toMinutes(slotStart);
  const end = start + durationMinutes;
  return busy.some(
    (range) => start < toMinutes(range.end) && end > toMinutes(range.start),
  );
};

/**
 * Calcula os horários livres do dia em intervalos de 30 minutos, agrupados por
 * período, removendo os que colidem com os intervalos ocupados (pausas /
 * horários já marcados).
 */
export const getAvailableSlots = (
  businessHours: ITimeRange,
  busy: ITimeRange[],
): AvailabilityByPeriod => {
  const result: AvailabilityByPeriod = { manha: [], tarde: [], noite: [] };
  for (const time of generateSlots(businessHours, SLOT_MINUTES)) {
    if (overlapsBusy(time, SLOT_MINUTES, busy)) continue;
    result[periodOf(time)].push(time);
  }
  return result;
};
