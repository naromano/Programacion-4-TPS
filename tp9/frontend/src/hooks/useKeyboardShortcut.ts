import { useEffect, useRef } from "react";

/**
 * Custom Hook: useKeyboardShortcut
 * Detecta combinaciones de teclado y ejecuta una acción
 @param key - La tecla a escuchar (ej: "b", "s")
 @param ctrl - Si debe presionarse Ctrl (default: true)
 @param shift - Si debe presionarse Shift (default: false)
 @param callback - Función a ejecutar cuando se detecte la combinación
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  { ctrl = false, shift = false, alt = false } = {}
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;

      // En Windows/Linux usar Ctrl, en Mac usar Cmd
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdMatch = isMac ? event.metaKey : event.ctrlKey;
      const modifier = ctrl ? cmdMatch : true;

      if (keyMatch && shiftMatch && altMatch && modifier) {
        event.preventDefault();
        callbackRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, shift, alt, ctrl]);
}
