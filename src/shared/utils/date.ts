/** Formata uma data como "AAAA-MM-DD" usando os componentes locais. */
export const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Converte uma string "AAAA-MM-DD" em Date (à meia-noite local). */
export const fromISODate = (iso: string): Date => new Date(`${iso}T00:00:00`);

/** Retorna uma nova data deslocada em `days` dias. */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/** Abreviação do dia da semana em pt-BR, minúscula e sem ponto (ex.: "ter"). */
export const getWeekdayShort = (date: Date): string =>
  new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(date)
    .replace(".", "")
    .toLowerCase();

/** Dia e mês no formato "DD/MM". */
export const getDayMonth = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};
