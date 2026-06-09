import type { ReactNode } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

export interface LayoutProps {
  /** Cor do estabelecimento, aplicada ao Header e ao Footer. */
  color: string;
  /** Nome do estabelecimento exibido no Header. */
  businessName: string;
  /** Conteúdo da tela atual — a única parte que muda entre as telas. */
  children: ReactNode;
}

/**
 * Estrutura fixa das telas do Marcadata: Header no topo, Footer embaixo e,
 * entre eles, o conteúdo da tela atual.
 *
 * O Header e o Footer são montados uma única vez por este Layout; ao navegar,
 * apenas `children` é substituído. Quando o roteamento for adicionado, basta
 * envolver as rotas com este Layout (ex.: usando um `<Outlet />` em `children`).
 */
export function Layout({ color, businessName, children }: LayoutProps) {
  return (
    <div className="mx-auto flex h-svh max-w-md flex-col bg-white">
      <Header color={color} businessName={businessName} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer color={color} />
    </div>
  );
}
