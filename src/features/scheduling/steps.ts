import {
  ListOrdered,
  CalendarDays,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export interface SchedulingStep {
  /** Número do passo (1-based). */
  id: number;
  /** Rótulo acessível do passo. */
  label: string;
  /** Ícone exibido no indicador de progresso. */
  icon: LucideIcon;
}

/**
 * As 3 etapas do agendamento, na ordem de exibição.
 * (Data, profissional e horário foram unificados na etapa 2.)
 * Os ícones podem ser trocados livremente por qualquer um do lucide-react.
 */
export const SCHEDULING_STEPS: SchedulingStep[] = [
  { id: 1, label: "Serviços", icon: ListOrdered },
  { id: 2, label: "Data e horário", icon: CalendarDays },
  { id: 3, label: "Seus dados", icon: ClipboardList },
];

export const TOTAL_STEPS = SCHEDULING_STEPS.length;
