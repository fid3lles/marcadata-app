/** Evento a ser adicionado ao calendário. */
export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  details?: string;
  location?: string;
}

/** Detecta a plataforma móvel a partir do user agent. */
export const getMobilePlatform = (): "ios" | "android" | "other" => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPad no iOS 13+ se identifica como Mac; conferimos o toque.
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && "ontouchend" in document)
  ) {
    return "ios";
  }
  return "other";
};

const pad = (value: number) => String(value).padStart(2, "0");

/** Data local no formato ICS flutuante: AAAAMMDDTHHMMSS. */
const toLocalStamp = (date: Date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}00`;

/** Data UTC no formato ICS: AAAAMMDDTHHMMSSZ. */
const toUtcStamp = (date: Date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate(),
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
    date.getUTCSeconds(),
  )}Z`;

/** Escapa caracteres especiais de texto em campos ICS. */
const escapeIcs = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

/** Monta o conteúdo de um arquivo .ics (iCalendar) para o evento. */
const buildIcs = (event: CalendarEvent): string =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Marcadata//Agendamento//PT-BR",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@marcadata`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toLocalStamp(event.start)}`,
    `DTEND:${toLocalStamp(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.details ? `DESCRIPTION:${escapeIcs(event.details)}` : "",
    event.location ? `LOCATION:${escapeIcs(event.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

/** URL do Google Calendar com o evento pré-preenchido. */
const buildGoogleCalendarUrl = (event: CalendarEvent): string => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toLocalStamp(event.start)}/${toLocalStamp(event.end)}`,
    details: event.details ?? "",
    location: event.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Adiciona o evento ao calendário do dispositivo:
 * - iOS: abre o app Calendário nativo via arquivo .ics;
 * - Android/desktop: abre o Google Calendar com o evento preenchido.
 */
export const addEventToCalendar = (event: CalendarEvent): void => {
  if (getMobilePlatform() === "ios") {
    const ics = buildIcs(event);
    window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
    return;
  }

  window.open(buildGoogleCalendarUrl(event), "_blank", "noopener");
};
