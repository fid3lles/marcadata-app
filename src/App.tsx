import { useEffect, useMemo, useState } from "react";
import { Loading } from "./shared/components";
import { businessService, type IBusiness } from "./features/business";

const MISSING_ID_MESSAGE = "Informe o id da loja na URL. Exemplo: ?id=1";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

function App() {
  // Recupera o id da loja via query param (ex.: ?id=1). Estável na sessão.
  const businessId = useMemo(
    () => new URLSearchParams(window.location.search).get("id"),
    [],
  );

  // Sem id não há o que buscar: já começa fora do loading, com a mensagem.
  const [loading, setLoading] = useState(() => businessId !== null);
  const [business, setBusiness] = useState<IBusiness | null>(null);
  const [error, setError] = useState<string | null>(() =>
    businessId === null ? MISSING_ID_MESSAGE : null,
  );

  useEffect(() => {
    if (businessId === null) return;

    // Evita atualizar o estado se o componente desmontar antes da resposta.
    let active = true;

    businessService
      .getById(Number(businessId))
      .then((data) => {
        if (active) setBusiness(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os dados da loja.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [businessId]);

  return (
    <div className="min-h-svh bg-slate-50 text-slate-800">
      {/* Enquanto busca os dados da loja, exibe o overlay de carregamento. */}
      <Loading show={loading} backgroundColor="#8340EC" />

      {/* Container centralizado e estreito: pensado primeiro para o celular. */}
      <div className="mx-auto flex min-h-svh max-w-md flex-col px-5">
        <header className="flex items-center gap-2 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <img src="/icon.svg" alt="Marcadata" className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Marcadata
          </span>
        </header>

        <main className="flex flex-1 flex-col py-6">
          {error && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              {error}
            </div>
          )}

          {business && (
            <>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
                {business.businessName}
              </h1>
              <p className="mt-2 text-slate-600">
                {business.address.street}, {business.address.number}
                {business.address.complement
                  ? ` — ${business.address.complement}`
                  : ""}
                <br />
                {business.address.district} · {business.address.city}/
                {business.address.state}
              </p>

              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Serviços
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {business.providedServices.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {service.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {service.duration} min
                      </p>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(service.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>

        <footer className="py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Marcadata
        </footer>
      </div>
    </div>
  );
}

export default App;
