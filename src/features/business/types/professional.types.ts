/** Profissional que pode atender o cliente. */
export interface IProfessional {
  id: number;
  firstname: string;
  lastname: string;
  /** Especialidade (ex.: "Cabeleireiro"). */
  specialty: string;
  /** URL da foto do profissional; pode vir vazia. */
  imageHref: string;
}
