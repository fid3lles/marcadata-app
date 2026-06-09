import { httpClient } from "../../../core/api";
import type { IBusiness } from "../types/business.types";

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
}

/** Instância pronta para uso na aplicação. */
export const businessService = new BusinessService();
