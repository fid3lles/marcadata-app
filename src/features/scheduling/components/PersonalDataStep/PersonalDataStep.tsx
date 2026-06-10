import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { toCssHex } from "../../../../shared/utils";
import {
  formatFullName,
  formatPhone,
  isValidFullName,
  isValidPhone,
} from "../../personalData";

export interface PersonalDataStepProps {
  /** Nome completo digitado. */
  name: string;
  /** Celular formatado. */
  phone: string;
  /** Confirmação do celular. */
  phoneConfirm: string;
  /** Consentimento de mensagens via WhatsApp. */
  consent: boolean;
  /** Cor do estabelecimento (borda ativa, checkbox). */
  color: string;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangePhoneConfirm: (value: string) => void;
  onToggleConsent: (value: boolean) => void;
}

/**
 * Etapa 4 do agendamento: dados do cliente (nome, celular e confirmação do
 * celular), com formatação/validação, consentimento de WhatsApp e espaço
 * reservado para um futuro captcha.
 */
export function PersonalDataStep({
  name,
  phone,
  phoneConfirm,
  consent,
  color,
  onChangeName,
  onChangePhone,
  onChangePhoneConfirm,
  onToggleConsent,
}: PersonalDataStepProps) {
  const hex = toCssHex(color);

  const nameInvalid = name.length > 0 && !isValidFullName(name);
  const phoneInvalid = phone.length > 0 && !isValidPhone(phone);
  const phoneMismatch = phoneConfirm.length > 0 && phoneConfirm !== phone;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <h2 className="text-lg font-bold text-slate-900">Seus dados</h2>

      <div className="mt-4 space-y-4">
        <Field
          label="Nome completo"
          value={name}
          onChange={(event) => onChangeName(formatFullName(event.target.value))}
          placeholder="Nome e sobrenome"
          autoComplete="name"
          activeColor={hex}
          error={nameInvalid ? "Informe nome e sobrenome." : undefined}
        />

        <Field
          label="Celular"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(event) => onChangePhone(formatPhone(event.target.value))}
          placeholder="11 91234-3296"
          autoComplete="tel"
          activeColor={hex}
          complete={isValidPhone(phone)}
          error={phoneInvalid ? "Informe um número válido com DDD." : undefined}
        />

        <Field
          label="Confirmar celular"
          type="tel"
          inputMode="numeric"
          value={phoneConfirm}
          onChange={(event) =>
            onChangePhoneConfirm(formatPhone(event.target.value))
          }
          placeholder="11 91234-3296"
          activeColor={hex}
          complete={isValidPhone(phoneConfirm)}
          error={phoneMismatch ? "Os números não coincidem." : undefined}
        />

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => onToggleConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ accentColor: hex }}
          />
          <span className="text-sm text-slate-600">
            Autorizo receber mensagens sobre o atendimento via WhatsApp
          </span>
        </label>

        {/* Espaço reservado para o captcha (em breve). */}
        <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
          Captcha em breve
        </div>
      </div>
    </div>
  );
}

interface FieldProps extends ComponentProps<"input"> {
  /** Rótulo exibido acima do campo. */
  label: string;
  /** Cor aplicada à borda quando o campo está focado. */
  activeColor: string;
  /** Mensagem de erro exibida abaixo do campo. */
  error?: string;
  /**
   * Quando o valor fica completo, o campo perde o foco (some o teclado),
   * para o usuário tocar no próximo.
   */
  complete?: boolean;
}

/** Campo de texto que destaca a borda com a cor da loja enquanto está focado. */
function Field({
  label,
  activeColor,
  error,
  complete,
  ...inputProps
}: FieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  // Ao ficar completo (e ainda focado), tira o foco para esconder o teclado.
  useEffect(() => {
    if (complete && document.activeElement === inputRef.current) {
      inputRef.current?.blur();
    }
  }, [complete]);

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...inputProps}
        ref={inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={focused ? { borderColor: activeColor } : undefined}
        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
