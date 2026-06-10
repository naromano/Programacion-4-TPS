import { useRef, useId } from "react";

/**
 * Custom Hook: useFormField
 * Combina useRef y useId para crear campos de formulario accesibles y enfocables
 * Retorna el ID único y la referencia al elemento
 */
export function useFormField() {
  const id = useId();
  const ref = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);

  const focus = () => {
    ref.current?.focus();
  };

  return {
    id,
    ref,
    focus,
  };
}
