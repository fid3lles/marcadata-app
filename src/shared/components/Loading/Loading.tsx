/** Logo servido a partir de `public/`. */
const LOGO_SRC = "/marcadata_logo.svg";

export interface LoadingProps {
  show: boolean;
  backgroundColor?: string;
  logoSize?: number;
  label?: string;
}

export function Loading({
  show,
  backgroundColor = "#ffffff",
  logoSize = 96,
  label = "Carregando…",
}: LoadingProps) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        width={logoSize}
        height={logoSize}
        className="animate-pulse-soft select-none"
        style={{ width: logoSize, height: logoSize }}
        draggable={false}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
