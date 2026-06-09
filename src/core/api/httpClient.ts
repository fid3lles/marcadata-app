import { API_BASE_PATH } from "./config";

/**
 * Erro lançado quando a API responde com status fora da faixa 2xx.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string) {
    super(`Request failed: ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Cliente HTTP central da aplicação.
 *
 * Concentra o context path ({@link API_BASE_PATH}) e o tratamento de erro,
 * para que os serviços de cada feature só precisem informar o caminho relativo.
 */
export const httpClient = {
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_PATH}${path}`, init);

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText);
    }

    return (await response.json()) as T;
  },

  async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_PATH}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...init,
    });

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText);
    }

    return (await response.json()) as T;
  },
};
