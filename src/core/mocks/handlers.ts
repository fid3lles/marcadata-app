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
        { id: 1, name: "Corte de cabelo", price: 60.0, duration: 59 },
        { id: 2, name: "Barba", price: 20.0, duration: 20 },
        { id: 3, name: "Sobrancelha", price: 10.0, duration: 5 },
      ],
    };

    return HttpResponse.json(business);
  }),
];
