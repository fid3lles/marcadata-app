import { httpClient } from "../../../core/api";
import type {
  ICreateScheduleRequest,
  ICreateScheduleResponse,
} from "../types";

/**
 * Serviço responsável por criar agendamentos.
 */
export class ScheduleService {
  /**
   * Cria um agendamento na agenda de um profissional.
   *
   * POST {@link API_BASE_PATH}/business/:businessId/professional/:professionalId/agenda
   *
   * @param businessId Id da loja.
   * @param professionalId Id do profissional.
   * @param payload Dados do cliente, termos e agendamento (serviços + início).
   */
  create(
    businessId: number,
    professionalId: number,
    payload: ICreateScheduleRequest,
  ): Promise<ICreateScheduleResponse> {
    return httpClient.post<ICreateScheduleResponse>(
      `/business/${businessId}/professional/${professionalId}/agenda`,
      payload,
    );
  }
}

/** Instância pronta para uso na aplicação. */
export const scheduleService = new ScheduleService();
