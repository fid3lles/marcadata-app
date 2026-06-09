/** Profissional que pode atender o cliente. */
export interface IProfessional {
  id: number;
  name: string;
  /** Especialidade (ex.: "Cabeleireiro"). */
  expertise: string;
  /** URL da foto do profissional; pode vir vazia. */
  imgHref: string;
}

/** Profissionais separados por disponibilidade em um horário. */
export interface IProfessionalsAvailability {
  available: IProfessional[];
  unavailable: IProfessional[];
}

/** Resposta do endpoint de profissionais de uma loja para um horário. */
export interface IBusinessProfessionals {
  businessId: number;
  professionals: IProfessionalsAvailability;
}
