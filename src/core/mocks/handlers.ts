import { http, HttpResponse, delay } from "msw";
import { API_BASE_PATH } from "../api";
import type {
  IAgenda,
  IBusiness,
  IBusinessProfessionals,
  IProfessional,
} from "../../features/business";
import { addDays, fromISODate, toISODate } from "../../shared/utils";

/** Profissionais base da loja (a disponibilidade varia por horário no mock). */
const PROFESSIONALS: IProfessional[] = [
  {
    id: 1,
    name: "João Silva",
    expertise: "Cabeleireiro",
    imgHref:
      "https://img.magnific.com/fotos-premium/cabeleireiro-trabalhando-em-um-salao-de-cabeleireiro-barbeiro-usando-tesoura-isolada-em-preto-cortar-cabelo-de-um-barbeiro-em-uma-barbearia-homem-caucasiano-barbador-em-salao-de-cabelo-barbearia-elegante_474717-185694.jpg",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    expertise: "Cabeleireira",
    imgHref:
      "https://i.pinimg.com/236x/f0/98/f5/f098f54268c1980db43620eae0b65918.jpg",
  },
  {
    id: 3,
    name: "Carlos Pereira",
    expertise: "Cabeleireiro",
    imgHref: "",
  },
];

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
        imageHref:
          "https://img.magnific.com/fotos-premium/o-processo-de-corte-de-cabelo-masculino-em-uma-barbearia-estilosa_199683-145.jpg",
        price: 60.0,
        duration: 62,
      },
      {
        id: 2,
        name: "Barba",
        description:
          "Barba de todos os tamanhos. Inclui lavagem, corte e finalização.",
        imageHref:
          "https://img.magnific.com/fotos-gratis/homem-bonito-a-cortar-a-barba-num-barbeiro_1303-20931.jpg",
        price: 20.0,
        duration: 20,
      },
      {
        id: 3,
        name: "Sobrancelha",
        description: "Limpamos sua sobrancelha com profissionalismo e cuidado.",
        imageHref:
          "https://blog.vonbarbarov.com.br/wp-content/uploads/2021/02/Sobrancelha-Masculina-Barbarov.png",
        price: 10.0,
        duration: 5,
      },
      {
        id: 4,
        name: "Combo sobrancelha + barba",
        description:
          "Combo com os dois serviços mais populares do salão, para você ficar com a aparência em dia e pagar menos.",
        imageHref: "",
        price: 25.5,
        duration: 5,
      },
      {
        id: 5,
        name: "Combo sobrancelha + barba + cabelo",
        description:
          "Cuidado completo para sua aparência, com os três serviços mais populares do salão e um desconto mais que especial.",
        imageHref: "",
        price: 70.0,
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
        imageHref: "",
        price: 45.0,
        duration: 50,
      },
      {
        id: 2,
        name: "Tosa higiênica",
        description:
          "Aparamos as regiões íntimas, patas e focinho para manter seu pet limpinho e confortável.",
        imageHref: "",
        price: 35.0,
        duration: 40,
      },
      {
        id: 3,
        name: "Tosa na máquina",
        description:
          "Tosa completa na máquina no comprimento de sua preferência, ideal para os dias quentes.",
        imageHref: "",
        price: 70.0,
        duration: 75,
      },
      {
        id: 4,
        name: "Banho + Tosa completa",
        description:
          "O pacote mais pedido: banho caprichado seguido de tosa completa, com hidratação de brinde.",
        imageHref: "",
        price: 99.9,
        duration: 120,
      },
      {
        id: 5,
        name: "Corte de unhas",
        description:
          "Corte e lixamento das unhas feito com cuidado por profissionais experientes.",
        imageHref: "",
        price: 15.0,
        duration: 15,
      },
      {
        id: 6,
        name: "Hidratação de pelos",
        description:
          "Tratamento intensivo que deixa os pelos macios, brilhantes e livres de nós.",
        imageHref: "",
        price: 55.0,
        duration: 45,
      },
      {
        id: 7,
        name: "Escovação dental",
        description:
          "Higiene bucal com creme dental próprio para pets, combatendo o mau hálito e o tártaro.",
        imageHref: "",
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

  // Agenda da loja: GET /scheduler/core/api/v1/business/:businessId/agenda
  // - ?datestart=AAAA-MM-DDTHH:mm:ssZ  → profissionais disponíveis no horário
  // - ?date=AAAA-MM-DD                 → ocupações/dias fechados/funcionamento
  http.get(
    `${API_BASE_PATH}/business/:businessId/agenda`,
    async ({ params, request }) => {
      await delay(800);

      const searchParams = new URL(request.url).searchParams;
      const businessId = Number(params.businessId);

      // Profissionais para um horário específico.
      const dateStart = searchParams.get("datestart");
      if (dateStart) {
        // A disponibilidade varia conforme a hora, só para a demo refletir a
        // troca de horário: um profissional fica indisponível por vez.
        const hour = Number(dateStart.slice(11, 13)) || 0;
        const unavailableIndex = hour % PROFESSIONALS.length;

        const professionals: IBusinessProfessionals = {
          businessId,
          professionals: {
            available: PROFESSIONALS.filter((_, i) => i !== unavailableIndex),
            unavailable: PROFESSIONALS.filter((_, i) => i === unavailableIndex),
          },
        };

        return HttpResponse.json(professionals);
      }

      // Datas geradas relativas à data pedida, para a demo ficar coerente.
      const dateParam = searchParams.get("date") ?? toISODate(new Date());
      const base = fromISODate(dateParam);
      const shift = (days: number) => toISODate(addDays(base, days));

      const agenda: IAgenda = {
        businessId,
        busyDays: [
          {
            date: shift(0),
            periods: [
              { start: "09:00", end: "10:00" },
              { start: "11:00", end: "11:05" },
            ],
          },
          {
            date: shift(1),
            periods: [
              { start: "08:00", end: "10:00" },
              { start: "10:00", end: "11:05" },
            ],
          },
        ],
        closedDays: [{ date: shift(5) }, { date: shift(6) }],
        openTime: { start: "09:00", end: "18:00" },
      };

      return HttpResponse.json(agenda);
    },
  ),

  // Criação de agendamento: POST /scheduler/core/api/v1/schedule
  http.post(`${API_BASE_PATH}/schedule`, async () => {
    await delay(1200);

    return HttpResponse.json({
      id: "1",
      startDateHour: "2026-01-01T09:00:00Z",
      endDateHour: "2026-01-01T17:00:00Z",
      address: {
        street: "Rua Exemplo",
        number: "123",
        complement: "Apto 45",
        district: "Centro",
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
        zipCode: "01234-567",
      },
    });
  }),
];
