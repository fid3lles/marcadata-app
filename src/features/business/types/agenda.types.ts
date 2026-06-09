/** Intervalo de tempo no formato "HH:mm" (usado em períodos e no horário de funcionamento). */
export interface ITimeRange {
  start: string;
  end: string;
}

/** Dia com horários já ocupados. */
export interface IBusyDay {
  /** Data no formato "AAAA-MM-DD". */
  date: string;
  /** Intervalos ocupados nesse dia. */
  periods: ITimeRange[];
}

/** Dia em que o estabelecimento está fechado. */
export interface IClosedDay {
  /** Data no formato "AAAA-MM-DD". */
  date: string;
}

/** Agenda do estabelecimento: ocupações, dias fechados e horário de funcionamento. */
export interface IAgenda {
  businessId: number;
  busyDays: IBusyDay[];
  closedDays: IClosedDay[];
  openTime: ITimeRange;
}
