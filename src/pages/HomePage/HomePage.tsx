import { useEffect, useMemo, useState } from "react";
import { Loading, Layout } from "../../shared/components";
import {
  businessService,
  BusinessInfo,
  type IBusiness,
} from "../../features/business";
import { SchedulingForm } from "../../features/scheduling";

const MISSING_ID_MESSAGE =
  "Informe o slug da loja na URL. Exemplo: ?id=shanttcabeleireiros";

/**
 * Página principal: carrega a loja a partir do `?id=` e renderiza o fluxo de
 * agendamento dentro do Layout.
 */
export function HomePage() {
  // Recupera o id da loja via query param (ex.: ?id=1). Estável na sessão.
  // Slug da loja via query param (ex.: ?id=shantt). Estável na sessão.
  const slug = useMemo(
    () => new URLSearchParams(window.location.search).get("id"),
    [],
  );

  // Sem slug não há o que buscar: já começa fora do loading, com a mensagem.
  const [loadingVisible, setLoadingVisible] = useState(() => slug !== null);
  const [business, setBusiness] = useState<IBusiness | null>(null);
  const [error, setError] = useState<string | null>(() =>
    slug === null ? MISSING_ID_MESSAGE : null,
  );

  useEffect(() => {
    if (slug === null) return;

    // Evita atualizar o estado se o componente desmontar antes da resposta.
    let active = true;

    businessService
      .getBySlug(slug)
      .then((data) => {
        // Não desliga o loading aqui: ele anima a revelação da cor e só some
        // ao fim da animação, via onRevealComplete.
        if (active) setBusiness(data);
      })
      .catch(() => {
        if (active) {
          setError("Não foi possível carregar os dados da loja.");
          setLoadingVisible(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <>
      {/* Carregamento: branco com logo preto pulsando; ao chegar os dados,
          anima o fundo para a cor da loja e some ao fim da animação. */}
      {loadingVisible && (
        <Loading
          revealColor={business?.color ?? null}
          onRevealComplete={() => setLoadingVisible(false)}
        />
      )}

      {error && !business && (
        <div className="flex min-h-svh items-center justify-center p-6 text-center text-sm text-amber-800">
          {error}
        </div>
      )}

      {business && (
        <Layout
          color={business.color}
          businessName={business.businessName}
          headerInfo={<BusinessInfo business={business} />}
        >
          <SchedulingForm business={business} />
        </Layout>
      )}
    </>
  );
}
