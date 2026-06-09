const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor numérico como moeda brasileira (ex.: 60 → "R$ 60,00"). */
export const formatCurrency = (value: number): string =>
  currencyFormatter.format(value);

/**
 * Formata uma duração em minutos.
 * Até 59 min, exibe em minutos; a partir de 60, converte para horas.
 *
 * @example
 * formatDuration(5)   // "5 min"
 * formatDuration(59)  // "59 min"
 * formatDuration(60)  // "1h"
 * formatDuration(90)  // "1h 30min"
 */
export const formatDuration = (minutes: number): string => {
  if (minutes <= 59) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0
    ? `${hours}h`
    : `${hours}h ${remainingMinutes}min`;
};
