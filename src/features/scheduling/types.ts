import type { IProvidedService } from "../business";

/** Serviço escolhido pelo usuário, com a quantidade selecionada. */
export interface SelectedService {
  service: IProvidedService;
  quantity: number;
}

/** Dados do agendamento dentro da requisição. */
export interface IScheduleInput {
  /** Ids dos serviços escolhidos. */
  selectedServicesIds: number[];
  /** Data e horário de início no formato "AAAA-MM-DDTHH:mm". */
  startDateTime: string;
}

/**
 * Corpo da requisição de criação de agendamento.
 * POST /business/:businessId/professional/:professionalId/agenda
 */
export interface ICreateScheduleRequest {
  fullname: string;
  /** Celular somente com dígitos (ex.: "11975313296"). */
  cellphone: string;
  /** Aceite dos termos (precisa ser true). */
  acceptedTerms: boolean;
  schedule: IScheduleInput;
}

/** Resposta da criação de agendamento. Datas em "AAAA-MM-DDTHH:mm". */
export interface ICreateScheduleResponse {
  scheduleId: number;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
}
