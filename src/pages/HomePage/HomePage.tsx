import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loading, Layout } from "../../shared/components";
import {
  businessService,
  BusinessInfo,
  type IBusiness,
} from "../../features/business";
import { SchedulingForm } from "../../features/scheduling";

/**
 * Página principal: carrega a loja a partir do slug no path (/:slug) e
 * renderiza o fluxo de agendamento dentro do Layout.
 */
export function HomePage() {
  // Slug da loja vindo do path da rota (ex.: /shanttcabeleireiros).
  const { slug } = useParams();

  const [loadingVisible, setLoadingVisible] = useState(() => Boolean(slug));
  const [business, setBusiness] = useState<IBusiness | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

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
