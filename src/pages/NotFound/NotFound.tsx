import { useMemo } from "react";
import eyeOfUniverse from "../../assets/eye_of_universe.svg";

/** Citações exibidas aleatoriamente no rodapé da página de erro. */
const QUOTES = [
  "KOUSA: Conseguimos ouvir os sinais de socorro das outras cápsulas de fuga, o que me dá esperança. Foli, você ainda está aqui? Não sei como sobreviver neste lugar sem você.\n\nKOUSA: (Não sei como ser eu sem você.)",
  "Toda decisão é tomada no escuro. Só tomando uma decisão podemos saber se ela estava certa ou não",
  "PYE: A ciência nos obriga a explodir o sol!",
  "Vem, senta aqui comigo, meu companheiro de viagem. Vamos sentar juntos e ver as estrelas morrerem.",
  "Estamos num loop temporal? Acho que faz sentido. O tempo tá meio estranho ultimamente.",
  "Nós não temos muita conexão, você e eu. Mesmo assim, esse encontro parece especial. Espero que não se importe se eu te considerar um amigo.",
];

/**
 * Página exibida para rotas não encontradas (catch-all).
 */
export function NotFound() {
  // Escolhe uma citação aleatória uma vez, ao montar a página.
  const quote = useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    [],
  );

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      {/* Logo centralizado no topo, na mesma cor cinza (via máscara). */}
      <div className="absolute inset-x-0 top-8 flex justify-center text-slate-400">
        <span
          aria-hidden="true"
          className="h-12 w-12"
          style={{
            backgroundColor: "currentColor",
            maskImage: `url("${import.meta.env.BASE_URL}marcadata_logo.svg")`,
            WebkitMaskImage: `url("${import.meta.env.BASE_URL}marcadata_logo.svg")`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </div>

      <p className="text-8xl font-black text-black">404</p>

      <p className="mt-4 font-semibold text-slate-700">
        Parece que a página na qual você solicitou não existe
      </p>

      {/* Citação + imagem ancoradas na base, sem afetar a centralização acima.
          A cor cinza fica no container; texto e imagem (via currentColor) a herdam. */}
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-4 px-6 text-slate-400">
        <p className="max-w-md whitespace-pre-line text-center text-sm font-medium italic">
          “{quote}”
        </p>

        <span
          aria-hidden="true"
          className="h-16 w-16"
          style={{
            backgroundColor: "currentColor",
            maskImage: `url("${eyeOfUniverse}")`,
            WebkitMaskImage: `url("${eyeOfUniverse}")`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </div>
    </div>
  );
}
