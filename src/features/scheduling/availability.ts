import type { ITimeRange } from "../business";

/** Períodos do dia. */
export type DayPeriod = "manha" | "tarde" | "noite";

/** Rótulos exibidos para cada período. */
export const PERIOD_LABELS: Record<DayPeriod, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

/** Horários livres agrupados por período. */
export type AvailabilityByPeriod = Record<DayPeriod, string[]>;

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const periodOf = (time: string): DayPeriod => {
  const minutes = toMinutes(time);
  if (minutes < 12 * 60) return "manha";
  if (minutes < 18 * 60) return "tarde";
  return "noite";
};

/** Gera horários de hora em hora dentro do funcionamento (fim exclusivo). */
const generateHourlySlots = (openTime: ITimeRange): string[] => {
  const start = toMinutes(openTime.start);
  const end = toMinutes(openTime.end);
  const slots: string[] = [];
  for (let minutes = start; minutes < end; minutes += 60) {
    const hours = Math.floor(minutes / 60);
    slots.push(`${String(hours).padStart(2, "0")}:00`);
  }
  return slots;
};

/** Verdadeiro se o horário cai dentro de algum intervalo ocupado. */
const isBusy = (time: string, busyPeriods: ITimeRange[]): boolean => {
  const slot = toMinutes(time);
  return busyPeriods.some(
    (period) => slot >= toMinutes(period.start) && slot < toMinutes(period.end),
  );
};

/**
 * Calcula os horários livres de um dia, agrupados por período,
 * removendo os que colidem com os intervalos ocupados.
 */
export const getAvailableSlots = (
  openTime: ITimeRange,
  busyPeriods: ITimeRange[],
): AvailabilityByPeriod => {
  const result: AvailabilityByPeriod = { manha: [], tarde: [], noite: [] };
  for (const time of generateHourlySlots(openTime)) {
    if (isBusy(time, busyPeriods)) continue;
    result[periodOf(time)].push(time);
  }
  return result;
};

/** Ordem em que os períodos são exibidos. */
export const PERIOD_ORDER: DayPeriod[] = ["manha", "tarde", "noite"];
