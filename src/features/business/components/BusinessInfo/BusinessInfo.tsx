import type { IBusiness } from "../../types/business.types";

export interface BusinessInfoProps {
  /** Estabelecimento cujas informações serão exibidas. */
  business: IBusiness;
}

/** Formata um CEP de 8 dígitos como "00000-000". */
const formatCep = (zip: string): string => {
  const digits = zip.replace(/\D/g, "");
  return digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : zip;
};

/**
 * Conteúdo da bottom sheet de informações do estabelecimento: nome e endereço.
 * Pensado para ser injetado no Header via a prop `headerInfo` do Layout.
 */
export function BusinessInfo({ business }: BusinessInfoProps) {
  const { address } = business;

  return (
    <div className="overflow-y-auto px-5 pb-5 pt-14">
      <h2 className="text-xl font-bold text-slate-900">
        {business.businessName}
      </h2>

      <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Endereço
      </h3>
      <p className="mt-1 leading-relaxed text-slate-700">
        {address.street}, {address.number}
        {address.complement ? ` — ${address.complement}` : ""}
        <br />
        {address.district}
        <br />
        {address.city}/{address.state}
        <br />
        CEP {formatCep(address.zip)}
      </p>
    </div>
  );
}
