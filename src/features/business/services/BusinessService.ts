import { httpClient } from "../../../core/api";
import type { IBusiness } from "../types/business.types";
import type { IAgenda } from "../types/agenda.types";

/**
 * Serviço responsável por consumir os endpoints de estabelecimento (loja).
 */
export class BusinessService {
  /**
   * Busca os detalhes de uma loja.
   *
   * GET {@link API_BASE_PATH}/business/:businessId
   *
   * @param businessId Id da loja.
   */
  getById(businessId: number): Promise<IBusiness> {
    return httpClient.get<IBusiness>(`/business/${businessId}`);
  }

  /**
   * Busca a agenda da loja a partir de uma data.
   *
   * GET {@link API_BASE_PATH}/business/:businessId/agenda?date=AAAA-MM-DD
   *
   * @param businessId Id da loja.
   * @param date Data inicial no formato "AAAA-MM-DD".
   */
  getAgenda(businessId: number, date: string): Promise<IAgenda> {
    return httpClient.get<IAgenda>(
      `/business/${businessId}/agenda?date=${date}`,
    );
  }
}

/** Instância pronta para uso na aplicação. */
export const businessService = new BusinessService();
