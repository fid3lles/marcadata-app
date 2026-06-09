import type { ReactNode } from "react";
import { Header } from "../Header";

export interface LayoutProps {
  /** Cor do estabelecimento, aplicada ao Header. */
  color: string;
  /** Nome do estabelecimento exibido no Header. */
  businessName: string;
  /** Conteúdo da bottom sheet de informações, aberta pelo ícone no Header. */
  headerInfo?: ReactNode;
  /** Conteúdo da tela atual — a única parte que muda entre as telas. */
  children: ReactNode;
}

/**
 * Estrutura fixa das telas do Marcadata: Header no topo e, abaixo,
 * o conteúdo da tela atual.
 *
 * O Header é montado uma única vez por este Layout; ao navegar, apenas
 * `children` é substituído. Quando o roteamento for adicionado, basta
 * envolver as rotas com este Layout (ex.: usando um `<Outlet />` em `children`).
 */
export function Layout({
  color,
  businessName,
  headerInfo,
  children,
}: LayoutProps) {
  return (
    <div className="mx-auto flex h-svh max-w-md flex-col bg-white">
      <Header color={color} businessName={businessName} info={headerInfo} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
