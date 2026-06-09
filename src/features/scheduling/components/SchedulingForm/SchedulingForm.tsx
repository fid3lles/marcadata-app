import { useState } from "react";
import { formatCurrency, toCssHex } from "../../../../shared/utils";
import type { IBusiness, IProvidedService } from "../../../business";
import { StepIndicator } from "../StepIndicator";
import { ServiceStep } from "../ServiceStep";
import { DateTimeStep } from "../DateTimeStep";
import { SCHEDULING_STEPS, TOTAL_STEPS } from "../../steps";
import type { SelectedService } from "../../types";

export interface SchedulingFormProps {
  /** Estabelecimento sendo agendado (cor, serviços, etc.). */
  business: IBusiness;
}

/**
 * Formulário de agendamento em 4 etapas. Compõe o miolo da tela:
 * indicador de progresso no topo, conteúdo da etapa atual no meio e
 * navegação embaixo.
 *
 * O conteúdo das etapas 2-4 ainda é placeholder — cada uma virará seu
 * próprio componente (DateTimeStep, ProfessionalStep, PersonalDataStep).
 */
export function SchedulingForm({ business }: SchedulingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    [],
  );

  const hex = toCssHex(business.color);
  const isFirst = currentStep === 1;
  const isLast = currentStep === TOTAL_STEPS;

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 1));

  // Define a quantidade de um serviço na seleção (insere ou atualiza).
  const upsertService = (service: IProvidedService, quantity: number) => {
    setSelectedServices((current) => {
      const exists = current.some((item) => item.service.id === service.id);
      if (exists) {
        return current.map((item) =>
          item.service.id === service.id ? { ...item, quantity } : item,
        );
      }
      return [...current, { service, quantity }];
    });
  };

  // Remove um serviço da seleção.
  const removeService = (serviceId: number) => {
    setSelectedServices((current) =>
      current.filter((item) => item.service.id !== serviceId),
    );
  };

  const selectedCount = selectedServices.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const selectedTotal = selectedServices.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0,
  );
  const hasSelection = selectedCount > 0;

  const activeStep = SCHEDULING_STEPS[currentStep - 1];

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 py-6">
      <StepIndicator currentStep={currentStep} color={business.color} />

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        {currentStep === 1 && (
          <ServiceStep
            services={business.providedServices}
            color={business.color}
            selectedServices={selectedServices}
            onConfirmService={upsertService}
            onRemoveService={removeService}
          />
        )}

        {currentStep === 2 && (
          <DateTimeStep
            businessId={business.businessId}
            color={business.color}
          />
        )}

        {currentStep > 2 && (
          // Placeholder das demais etapas — serão substituídas pelos componentes reais.
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {activeStep.label}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Etapa {currentStep} de {TOTAL_STEPS} · conteúdo em construção.
            </p>
          </div>
        )}
      </div>

      {isFirst ? (
        // Etapa 1: resumo da seleção + Continuar, visível apenas com seleção.
        hasSelection && (
          <div className="-mx-5 -mb-6 mt-6 flex items-center justify-between gap-3 rounded-t-2xl bg-white px-5 pb-6 pt-4 shadow-[0_-4px_16px_-6px_rgba(0,0,0,0.15)]">
            <p className="text-sm">
              <span className="font-semibold text-slate-900">
                {formatCurrency(selectedTotal)}
              </span>
              <span className="text-slate-400">
                {" / "}
                {selectedCount} {selectedCount === 1 ? "serviço" : "serviços"}
              </span>
            </p>
            <button
              type="button"
              onClick={goNext}
              className="rounded-xl px-6 py-3.5 font-semibold text-white transition active:scale-[0.98]"
              style={{ backgroundColor: hex }}
            >
              Continuar
            </button>
          </div>
        )
      ) : (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 transition active:scale-[0.98]"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={isLast ? undefined : goNext}
            className="flex-1 rounded-xl py-3.5 font-semibold text-white transition active:scale-[0.98]"
            style={{ backgroundColor: hex }}
          >
            {isLast ? "Confirmar agendamento" : "Continuar"}
          </button>
        </div>
      )}
    </div>
  );
}
