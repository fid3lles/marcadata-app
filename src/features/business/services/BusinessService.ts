import { httpClient } from "../../../core/api";
import type { IBusiness } from "../types/business.types";
import type { IAgenda, IProfessionalAgenda } from "../types/agenda.types";
import type { IBusinessProfessionals } from "../types/professional.types";

/**
 * Serviço responsável por consumir os endpoints de estabelecimento (loja).
 */
export class BusinessService {
  /**
   * Busca os detalhes de uma loja pelo seu slug.
   *
   * GET {@link API_BASE_PATH}/business/:slug
   *
   * @param slug Slug da loja (string).
   */
  getBySlug(slug: string): Promise<IBusiness> {
    return httpClient.get<IBusiness>(`/business/${slug}`);
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

  /**
   * Busca os profissionais disponíveis (e indisponíveis) para um horário.
   *
   * GET {@link API_BASE_PATH}/business/:businessId/agenda?datestart=AAAA-MM-DDTHH:mm:ssZ
   *
   * @param businessId Id da loja.
   * @param dateStart Data e horário escolhidos, no formato ISO (ex.: "2026-06-09T10:00:00Z").
   */
  getProfessionals(
    businessId: number,
    dateStart: string,
  ): Promise<IBusinessProfessionals> {
    return httpClient.get<IBusinessProfessionals>(
      `/business/${businessId}/agenda?datestart=${encodeURIComponent(dateStart)}`,
    );
  }

  /**
   * Busca a agenda de um profissional em uma data.
   *
   * GET {@link API_BASE_PATH}/business/:businessId/professional/:professionalId/agenda?date=AAAA-MM-DD
   *
   * @param businessId Id da loja.
   * @param professionalId Id do profissional.
   * @param date Data no formato "AAAA-MM-DD".
   */
  getProfessionalAgenda(
    businessId: number,
    professionalId: number,
    date: string,
  ): Promise<IProfessionalAgenda> {
    return httpClient.get<IProfessionalAgenda>(
      `/business/${businessId}/professional/${professionalId}/agenda?date=${date}`,
    );
  }
}

/** Instância pronta para uso na aplicação. */
export const businessService = new BusinessService();
