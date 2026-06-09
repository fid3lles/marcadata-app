import { httpClient } from "../../../core/api";
import type { IScheduleRequest, IScheduleResponse } from "../types";

/**
 * Serviço responsável por criar agendamentos.
 */
export class ScheduleService {
  /**
   * Cria um agendamento.
   *
   * POST {@link API_BASE_PATH}/schedule
   *
   * @param payload Dados do cliente, serviços, data/hora e profissional.
   */
  create(payload: IScheduleRequest): Promise<IScheduleResponse> {
    return httpClient.post<IScheduleResponse>("/schedule", payload);
  }
}

/** Instância pronta para uso na aplicação. */
export const scheduleService = new ScheduleService();
