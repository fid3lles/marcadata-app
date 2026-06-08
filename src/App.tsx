import { useEffect, useState } from "react";
import { Loading } from "./shared/components";

function App() {
  const [loading, setLoading] = useState(true);

  // Teste: exibe o loading assim que o app inicia e o desliga após 3s.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-svh bg-slate-50 text-slate-800">
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

        <main className="flex flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
            Agende seu horário em segundos
          </h1>
          <p className="mt-4 text-slate-600">
            O estabelecimento publica os dias livres e você faz o check-in
            direto pelo celular, sem ligações nem filas.
          </p>

          <button
            type="button"
            className="mt-8 w-full rounded-xl bg-brand-600 py-3.5 text-center font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
          >
            Ver horários disponíveis
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            Setup do projeto concluído — pronto para começar a construir.
          </p>
        </main>

        <footer className="py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Marcadata
        </footer>
      </div>
    </div>
  );
}

export default App;
