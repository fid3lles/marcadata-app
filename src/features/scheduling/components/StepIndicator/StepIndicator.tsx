import { Fragment } from "react";
import { CircleCheck } from "lucide-react";
import { toCssHex } from "../../../../shared/utils";
import { SCHEDULING_STEPS } from "../../steps";

export interface StepIndicatorProps {
  /** Passo atual (1-based). */
  currentStep: number;
  /** Cor do estabelecimento aplicada aos círculos e linhas. */
  color: string;
}

/**
 * Indicador de progresso do agendamento.
 *
 * Cada etapa é um círculo com seu ícone, ligado ao próximo por uma linha.
 * Os passos já alcançados ficam preenchidos com a cor do estabelecimento;
 * os pendentes ficam apenas com a borda.
 */
export function StepIndicator({ currentStep, color }: StepIndicatorProps) {
  const hex = toCssHex(color);

  return (
    <nav
      aria-label="Progresso do agendamento"
      className="flex items-center px-2"
    >
      {SCHEDULING_STEPS.map((step, index) => {
        const reached = step.id <= currentStep;
        const completed = step.id < currentStep;
        // Etapa concluída vira check; atual e pendentes mantêm o próprio ícone.
        const Icon = completed ? CircleCheck : step.icon;

        return (
          <Fragment key={step.id}>
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
              style={{
                borderColor: hex,
                backgroundColor: reached ? hex : "#ffffff",
                color: reached ? "#ffffff" : hex,
              }}
              aria-current={step.id === currentStep ? "step" : undefined}
              aria-label={`Passo ${step.id} de ${SCHEDULING_STEPS.length}: ${step.label}${
                completed ? " (concluído)" : ""
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>

            {index < SCHEDULING_STEPS.length - 1 && (
              <div
                className="h-0.75 flex-1 rounded-full"
                style={{ backgroundColor: hex }}
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
