import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { CalendarPlus, CircleCheckBig, Loader2, Send } from "lucide-react";
import whatsappIcon from "../../../../assets/whatsapp_icon.svg";
import { formatCurrency, toCssHex, toISODate } from "../../../../shared/utils";
import {
  businessService,
  type IBusiness,
  type IBusinessProfessionals,
  type IProfessionalAgenda,
  type IProvidedService,
} from "../../../business";
import { StepIndicator } from "../StepIndicator";
import { ServiceStep } from "../ServiceStep";
import { DateTimeStep } from "../DateTimeStep";
import { PersonalDataStep } from "../PersonalDataStep";
import { TOTAL_STEPS } from "../../steps";
import { isValidFullName, isValidPhone } from "../../personalData";
import { scheduleService } from "../../services/ScheduleService";
import type { IScheduleRequest, SelectedService } from "../../types";

export interface SchedulingFormProps {
  /** Estabelecimento sendo agendado (cor, serviços, etc.). */
  business: IBusiness;
}

/**
 * Formulário de agendamento em 3 etapas:
 * 1) serviços; 2) data → profissional → horário; 3) dados do cliente.
 *
 * Todo o estado vive aqui, então o usuário pode ir e voltar sem perder o que
 * já selecionou. A agenda de cada profissional é cacheada por (profissional, dia).
 */
export function SchedulingForm({ business }: SchedulingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Etapa 1 — serviços.
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    [],
  );

  // Etapa 2 — data, profissional e horário.
  const todayIso = useMemo(() => toISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayIso);
  const [professionals, setProfessionals] =
    useState<IBusinessProfessionals | null>(null);
  const [professionalsLoading, setProfessionalsLoading] = useState(false);
  const [professionalsError, setProfessionalsError] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    number | null
  >(null);
  // Agendas por (profissionalId-data) já consultadas, para não refazer requisição.
  const [agendaCache, setAgendaCache] = useState<
    Record<string, IProfessionalAgenda>
  >({});
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agendaError, setAgendaError] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Etapa 3 — dados do cliente.
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPhoneConfirm, setCustomerPhoneConfirm] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  // Envio do agendamento.
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);

  // Confetes da tela de sucesso (saem de trás do ícone de check).
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const checkIconRef = useRef<HTMLSpanElement>(null);

  const hex = toCssHex(business.color);
  const isFirst = currentStep === 1;
  const isLast = currentStep === TOTAL_STEPS;

  // Agenda do profissional para a data atual (do cache, se existir).
  const agendaKey =
    selectedProfessionalId !== null && selectedDate
      ? `${selectedProfessionalId}-${selectedDate}`
      : null;
  const professionalAgenda = agendaKey ? (agendaCache[agendaKey] ?? null) : null;

  // Ao concluir, dispara uma explosão de confetes saindo de trás do ícone.
  useEffect(() => {
    if (!submitted) return;

    const timeout = setTimeout(() => {
      const canvas = confettiCanvasRef.current;
      const icon = checkIconRef.current;
      if (!canvas || !icon) return;

      const fire = confetti.create(canvas, { resize: true });
      const canvasRect = canvas.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();

      const origin = {
        x: (iconRect.left + iconRect.width / 2 - canvasRect.left) / canvasRect.width,
        y: (iconRect.top + iconRect.height / 2 - canvasRect.top) / canvasRect.height,
      };

      fire({
        particleCount: 140,
        spread: 100,
        startVelocity: 45,
        ticks: 220,
        origin,
        colors: [hex, "#34d399", "#fbbf24", "#60a5fa", "#f472b6"],
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [submitted, hex]);

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 1));

  // Busca os profissionais da loja uma única vez, ao chegar na etapa 2.
  useEffect(() => {
    if (currentStep !== 2 || professionals) return;

    let active = true;
    setProfessionalsLoading(true);
    setProfessionalsError(false);

    businessService
      .getProfessionals(business.businessId, `${todayIso}T00:00:00Z`)
      .then((data) => {
        if (active) setProfessionals(data);
      })
      .catch(() => {
        if (active) setProfessionalsError(true);
      })
      .finally(() => {
        if (active) setProfessionalsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentStep, professionals, business.businessId, todayIso]);

  // Busca a agenda do profissional para a data escolhida (com cache).
  useEffect(() => {
    if (currentStep !== 2 || selectedProfessionalId === null || !selectedDate) {
      return;
    }

    const key = `${selectedProfessionalId}-${selectedDate}`;
    if (agendaCache[key]) return; // já consultado

    let active = true;
    setAgendaLoading(true);
    setAgendaError(false);

    businessService
      .getProfessionalAgenda(
        business.businessId,
        selectedProfessionalId,
        selectedDate,
      )
      .then((data) => {
        if (active) setAgendaCache((cache) => ({ ...cache, [key]: data }));
      })
      .catch(() => {
        if (active) setAgendaError(true);
      })
      .finally(() => {
        if (active) setAgendaLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    currentStep,
    selectedProfessionalId,
    selectedDate,
    business.businessId,
    agendaCache,
  ]);

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

  // Trocar de dia reseta o horário (mantém o profissional; a agenda recarrega).
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // Trocar o profissional reseta o horário (os slots dele são outros).
  const handleSelectProfessional = (id: number) => {
    setSelectedProfessionalId(id);
    setSelectedTime(null);
  };

  // "Escolher outro": volta ao carrossel de profissionais.
  const handleClearProfessional = () => {
    setSelectedProfessionalId(null);
    setSelectedTime(null);
  };

  // Monta o payload e cria o agendamento (POST /schedule).
  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || selectedProfessionalId === null) {
      return;
    }

    const payload: IScheduleRequest = {
      customerName: customerName.trim(),
      customerCellphone: customerPhone.replace(/\D/g, ""),
      startDateTime: `${selectedDate}T${selectedTime}`,
      servicesSelected: selectedServices.map((item) => ({
        id: item.service.id,
        quantity: item.quantity,
      })),
      estimatedTime: selectedServices.reduce(
        (sum, item) => sum + item.service.duration * item.quantity,
        0,
      ),
      professionalId: selectedProfessionalId,
      businessId: business.businessId,
    };

    setSubmitting(true);
    setSubmitError(false);

    scheduleService
      .create(payload)
      .then((response) => {
        setScheduleId(response.id);
        setSubmitted(true);
      })
      .catch(() => setSubmitError(true))
      .finally(() => setSubmitting(false));
  };

  // Abre o Google Calendar já com os dados do agendamento preenchidos.
  const handleAddToCalendar = () => {
    if (!selectedDate || !selectedTime) return;

    const start = new Date(`${selectedDate}T${selectedTime}`);
    const minutes =
      selectedServices.reduce(
        (sum, item) => sum + item.service.duration * item.quantity,
        0,
      ) || 60;
    const end = new Date(start.getTime() + minutes * 60_000);

    // Formato exigido pelo Google Calendar: AAAAMMDDTHHMMSS (horário local).
    const fmt = (date: Date) =>
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
        "T",
        String(date.getHours()).padStart(2, "0"),
        String(date.getMinutes()).padStart(2, "0"),
        "00",
      ].join("");

    const { address } = business;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Agendamento · ${business.businessName}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: selectedServices
        .map((item) => `${item.quantity}x ${item.service.name}`)
        .join(", "),
      location: `${address.street}, ${address.number} - ${address.city}/${address.state}`,
    });

    window.open(
      `https://calendar.google.com/calendar/render?${params.toString()}`,
      "_blank",
      "noopener",
    );
  };

  // Abre o WhatsApp com uma mensagem inicial.
  // TODO: direcionar ao número do estabelecimento quando a API fornecê-lo.
  const handleContactWhatsApp = () => {
    const message = `Olá! Acabei de fazer um agendamento na ${business.businessName}.`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener",
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

  // Habilitação do "Continuar"/"Agendar" por etapa:
  // - etapa 2: exige data, profissional e horário;
  // - etapa 3: exige nome, celular válido, confirmação igual e consentimento.
  const continueDisabled =
    (currentStep === 2 &&
      !(
        selectedDate !== null &&
        selectedProfessionalId !== null &&
        selectedTime !== null
      )) ||
    (currentStep === 3 &&
      !(
        isValidFullName(customerName) &&
        isValidPhone(customerPhone) &&
        customerPhoneConfirm === customerPhone &&
        whatsappConsent
      ));

  // Após o sucesso, substitui o formulário pela confirmação.
  if (submitted) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col px-6 pb-6 animate-fade-in">
        {/* Canvas dos confetes — atrás do conteúdo (ícone/textos com z-10). */}
        <canvas
          ref={confettiCanvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Id do agendamento, alinhado ao topo. */}
        <p className="relative z-10 pt-2 text-center text-sm text-slate-500">
          ID do agendamento:{" "}
          <span className="font-semibold text-slate-700">{scheduleId}</span>
        </p>

        {/* Mensagem de sucesso, centralizada no espaço disponível. */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span ref={checkIconRef} className="relative z-10">
            <CircleCheckBig
              className="h-24 w-24"
              style={{ color: hex }}
              aria-hidden="true"
            />
          </span>
          <h2 className="relative z-10 mt-6 text-2xl font-bold text-slate-900">
            Agendamento Concluído!
          </h2>
          <p className="relative z-10 mt-3 text-slate-500">
            Você receberá uma mensagem via WhatsApp assim que o estabelecimento
            confirmar o seu agendamento!
          </p>
        </div>

        {/* Ações */}
        <div className="relative z-10 space-y-3">
          <button
            type="button"
            onClick={handleAddToCalendar}
            style={{ borderColor: hex, color: hex }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 bg-white py-3.5 font-semibold transition active:scale-[0.98]"
          >
            <CalendarPlus className="h-5 w-5" aria-hidden="true" />
            Adicionar ao calendário
          </button>

          <button
            type="button"
            onClick={handleContactWhatsApp}
            style={{ borderColor: hex, color: hex }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 bg-white py-3.5 font-semibold transition active:scale-[0.98]"
          >
            {/* Glifo do WhatsApp colorido na cor da loja via máscara CSS. */}
            <span
              aria-hidden="true"
              className="h-5 w-5"
              style={{
                backgroundColor: hex,
                maskImage: `url("${whatsappIcon}")`,
                WebkitMaskImage: `url("${whatsappIcon}")`,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
            Falar com estabelecimento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-4">
      <StepIndicator currentStep={currentStep} color={business.color} />

      <div
        key={currentStep}
        className="mt-5 flex min-h-0 flex-1 flex-col animate-fade-in"
      >
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
            color={business.color}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            professionals={professionals}
            professionalsLoading={professionalsLoading}
            professionalsError={professionalsError}
            selectedProfessionalId={selectedProfessionalId}
            onSelectProfessional={handleSelectProfessional}
            onClearProfessional={handleClearProfessional}
            professionalAgenda={professionalAgenda}
            agendaLoading={agendaLoading}
            agendaError={agendaError}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        )}

        {currentStep === 3 && (
          <PersonalDataStep
            name={customerName}
            phone={customerPhone}
            phoneConfirm={customerPhoneConfirm}
            consent={whatsappConsent}
            color={business.color}
            onChangeName={setCustomerName}
            onChangePhone={setCustomerPhone}
            onChangePhoneConfirm={setCustomerPhoneConfirm}
            onToggleConsent={setWhatsappConsent}
          />
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
        <div className="mt-6">
          {submitError && (
            <p className="mb-3 text-center text-sm text-red-500">
              Não foi possível concluir o agendamento. Tente novamente.
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="flex-1 rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 transition active:scale-[0.98] disabled:opacity-40"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={isLast ? handleSubmit : goNext}
              disabled={continueDisabled || submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
              style={{ backgroundColor: hex }}
            >
              {isLast ? (
                submitting ? (
                  <>
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Agendando…
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" aria-hidden="true" />
                    Agendar
                  </>
                )
              ) : (
                "Continuar"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
