import { useState, useEffect, useRef, useCallback } from 'react';
import { autocompleteClient } from '../services/clients';
import type { AutocompleteResult } from '../types/clients';

// Autocompletado de cliente por RUT o email
export function useClientAutocomplete(
  rut: string,
  clientEmail: string,
  onResult: (result: AutocompleteResult) => void,
  enabled: boolean = true,
) {
  // Estado de carga
  const [autoLoading, setAutoLoading] = useState(false);
  // Estado de error
  const [autoError, setAutoError] = useState('');
  // Ref para el callback
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  // Autocompletado de cliente por RUT o email
  useEffect(() => {
    // Si está deshabilitado, no hace nada
    if (!enabled) return;
    // Combina RUT y email
    const q = rut.trim() || clientEmail.trim();
    // Si no hay query o es muy corta, sale
    if (!q || q.length < 3) { setAutoError(''); return; }

    // Aborta la consulta anterior
    const controller = new AbortController();
    setAutoLoading(true);
    setAutoError('');

    // Timer para debounce
    const timer = setTimeout(async () => {
      try {
        // Consulta autocompletado
        const result = await autocompleteClient(q, controller.signal);
        // Llama al callback con el resultado
        onResultRef.current(result);
        setAutoError('');
      } catch (err: any) {
        // Ignora errores de cancelación
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        if (err.response?.status === 404) setAutoError('Cliente no encontrado');
        else if (err.code === 'ECONNABORTED') setAutoError('La consulta excedió el tiempo de espera');
        else setAutoError('Error al consultar');
      } finally {
        setAutoLoading(false);
      }
    }, 400);

    // Cleanup
    return () => { clearTimeout(timer); controller.abort(); };
  }, [enabled, rut, clientEmail]);

  // Limpia el error
  const clearAutoError = useCallback(() => setAutoError(''), []);

  // Retorna el estado del autocompletado
  return { autoLoading, autoError, clearAutoError };
}
