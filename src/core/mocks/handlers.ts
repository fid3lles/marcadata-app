import { http, HttpResponse, delay } from "msw";
import { API_BASE_PATH } from "../api";
import type { IBusiness } from "../../features/business";

/** Lojas mockadas, indexadas pelo businessId. */
const BUSINESSES: Record<string, IBusiness> = {
  "1": {
    businessId: 1,
    businessName: "Shantt Cabeleireiros",
    color: "8340EC",
    address: {
      street: "Av. da Saudade",
      number: 412,
      complement: "",
      district: "Vila Nossa Sra. das Vitorias",
      city: "Mauá",
      state: "SP",
      country: "Brasil",
      zip: "09360000",
    },
    providedServices: [
      {
        id: 1,
        name: "Corte de cabelo",
        description:
          "Corte de cabelo profissional em todos os tipos, estilos e sexos. Inclui lavagem, corte e finalização.",
        price: 60.0,
        duration: 62,
      },
      {
        id: 2,
        name: "Barba",
        description:
          "Barba de todos os tamanhos. Inclui lavagem, corte e finalização.",
        price: 20.0,
        duration: 20,
      },
      {
        id: 3,
        name: "Sobrancelha",
        description: "Limpamos sua sobrancelha com profissionalismo e cuidado.",
        price: 10.0,
        duration: 5,
      },
      {
        id: 4,
        name: "Combo sobrancelha + barba",
        description:
          "Combo com os dois serviços mais populares do salão, para você ficar com a aparência em dia e pagar menos.",
        price: 25.5,
        duration: 5,
      },
      {
        id: 5,
        name: "Combo sobrancelha + barba + cabelo",
        description:
          "Cuidado completo para sua aparência, com os três serviços mais populares do salão e um desconto mais que especial.",
        price: 70.0,
        duration: 5,
      },
      {
        id: 6,
        name: "Sobrancelha",
        description: "Limpamos sua sobrancelha com profissionalismo e cuidado.",
        price: 10.0,
        duration: 5,
      },
      {
        id: 7,
        name: "Sobrancelha",
        description: "Limpamos sua sobrancelha com profissionalismo e cuidado.",
        price: 10.0,
        duration: 5,
      },
    ],
  },

  "2": {
    businessId: 2,
    businessName: "AuMiau Petshop & Banho",
    color: "fce303",
    address: {
      street: "Rua dos Girassóis",
      number: 88,
      complement: "Loja 3",
      district: "Jardim Primavera",
      city: "Santo André",
      state: "SP",
      country: "Brasil",
      zip: "09190010",
    },
    providedServices: [
      {
        id: 1,
        name: "Banho",
        description:
          "Banho completo com shampoo neutro, secagem e perfume. Para cães e gatos de todos os portes.",
        price: 45.0,
        duration: 50,
      },
      {
        id: 2,
        name: "Tosa higiênica",
        description:
          "Aparamos as regiões íntimas, patas e focinho para manter seu pet limpinho e confortável.",
        price: 35.0,
        duration: 40,
      },
      {
        id: 3,
        name: "Tosa na máquina",
        description:
          "Tosa completa na máquina no comprimento de sua preferência, ideal para os dias quentes.",
        price: 70.0,
        duration: 75,
      },
      {
        id: 4,
        name: "Banho + Tosa completa",
        description:
          "O pacote mais pedido: banho caprichado seguido de tosa completa, com hidratação de brinde.",
        price: 99.9,
        duration: 120,
      },
      {
        id: 5,
        name: "Corte de unhas",
        description:
          "Corte e lixamento das unhas feito com cuidado por profissionais experientes.",
        price: 15.0,
        duration: 15,
      },
      {
        id: 6,
        name: "Hidratação de pelos",
        description:
          "Tratamento intensivo que deixa os pelos macios, brilhantes e livres de nós.",
        price: 55.0,
        duration: 45,
      },
      {
        id: 7,
        name: "Escovação dental",
        description:
          "Higiene bucal com creme dental próprio para pets, combatendo o mau hálito e o tártaro.",
        price: 25.0,
        duration: 20,
      },
    ],
  },
};

/**
 * Request handlers do MSW.
 *
 * Cada handler intercepta uma requisição e devolve uma resposta mockada.
 * Conforme as features forem surgindo, adicione aqui (ou importe os handlers
 * de cada feature e faça o spread neste array).
 */
export const handlers = [
  // Detalhes da loja: GET /scheduler/core/api/v1/business/:businessId
  http.get(`${API_BASE_PATH}/business/:businessId`, async ({ params }) => {
    // Delay fixo para simular latência de rede.
    await delay(3000);

    // Retorna a loja correspondente ao id; cai na primeira como fallback.
    const business = BUSINESSES[String(params.businessId)] ?? BUSINESSES["1"];

    return HttpResponse.json(business);
  }),
];
