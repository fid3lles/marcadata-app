/**
 * Formata um nome enquanto o usuário digita: remove caracteres que não sejam
 * letras/espaços, evita espaços no início e duplicados, e capitaliza cada
 * palavra. Mantém um espaço final para permitir digitar o sobrenome.
 */
export const formatFullName = (value: string): string => {
  const cleaned = value
    .replace(/[^\p{L}\s]/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/, "");

  return cleaned.replace(
    /(^|\s)(\p{L})/gu,
    (_, separator: string, letter: string) => separator + letter.toUpperCase(),
  );
};

/** Válido quando há ao menos nome e sobrenome (cada um com 2+ letras). */
export const isValidFullName = (value: string): boolean => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
};

/** Formata o celular no padrão "DD NNNNN-NNNN" (ex.: "11 91234-3296"). */
export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/** Válido quando há 11 dígitos (DDD + celular com 9 dígitos). */
export const isValidPhone = (value: string): boolean =>
  value.replace(/\D/g, "").length === 11;
