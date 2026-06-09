import type { IProvidedService } from "../business";

/** Serviço escolhido pelo usuário, com a quantidade selecionada. */
export interface SelectedService {
  service: IProvidedService;
  quantity: number;
}
