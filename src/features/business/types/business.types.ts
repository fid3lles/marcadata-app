/** Endereço de um estabelecimento. */
export interface IAddress {
  street: string;
  number: number;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

/** Serviço oferecido por um estabelecimento. */
export interface IProvidedService {
  id: number;
  name: string;
  description: string;
  imageHref: string;
  /** Preço em reais. */
  price: number;
  /** Duração do serviço em minutos. */
  duration: number;
}

/** Estabelecimento (loja) e seus dados de atendimento. */
export interface IBusiness {
  businessId: number;
  businessName: string;
  /** Cor da marca em hexadecimal, sem o `#` (ex.: "8340EC"). */
  color: string;
  address: IAddress;
  providedServices: IProvidedService[];
}
