import type { IProvidedService } from "../business";

/** Serviço escolhido pelo usuário, com a quantidade selecionada. */
export interface SelectedService {
  service: IProvidedService;
  quantity: number;
}

/** Serviço enviado no corpo do agendamento (id + quantidade). */
export interface IScheduleServiceSelection {
  id: number;
  quantity: number;
}

/** Corpo da requisição de criação de agendamento (POST /schedule). */
export interface IScheduleRequest {
  customerName: string;
  /** Celular somente com dígitos (ex.: "11975313296"). */
  customerCellphone: string;
  /** Data e horário de início no formato "AAAA-MM-DDTHH:mm". */
  startDateTime: string;
  servicesSelected: IScheduleServiceSelection[];
  /** Tempo total estimado em minutos. */
  estimatedTime: number;
  professionalId: number;
  businessId: number;
}

/** Endereço retornado na confirmação do agendamento. */
export interface IScheduleAddress {
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

/** Resposta da criação de agendamento. */
export interface IScheduleResponse {
  id: string;
  startDateHour: string;
  endDateHour: string;
  address: IScheduleAddress;
}
