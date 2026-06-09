import { http, HttpResponse, delay } from "msw";
import { API_BASE_PATH } from "../api";
import type { IBusiness } from "../../features/business";

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

    const business: IBusiness = {
      businessId: Number(params.businessId),
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
          description:
            "Limpamos sua sobrancelha com profissionalismo e cuidado.",
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
          description:
            "Limpamos sua sobrancelha com profissionalismo e cuidado.",
          price: 10.0,
          duration: 5,
        },
        {
          id: 7,
          name: "Sobrancelha",
          description:
            "Limpamos sua sobrancelha com profissionalismo e cuidado.",
          price: 10.0,
          duration: 5,
        },
      ],
    };

    return HttpResponse.json(business);
  }),
];
