import { useEffect, useMemo, useState } from "react";
import { Loading, Layout } from "./shared/components";
import { businessService, type IBusiness } from "./features/business";
import { SchedulingForm } from "./features/scheduling";

const MISSING_ID_MESSAGE = "Informe o id da loja na URL. Exemplo: ?id=1";

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
    <>
      {/* Enquanto busca os dados da loja, exibe o overlay de carregamento. */}
      <Loading show={loading} backgroundColor="#8340EC" />

      {error && !business && (
        <div className="flex min-h-svh items-center justify-center p-6 text-center text-sm text-amber-800">
          {error}
        </div>
      )}

      {business && (
        <Layout color={business.color} businessName={business.businessName}>
          <SchedulingForm business={business} />
        </Layout>
      )}
    </>
  );
}

export default App;
