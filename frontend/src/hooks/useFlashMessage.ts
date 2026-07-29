import { useState, useCallback } from 'react';
import type { FlashMessage } from '../types/flash-message';

// Hook para mostrar mensajes flash
export function useFlashMessage() {
  // Estado del mensaje
  const [message, setMessage] = useState<FlashMessage | null>(null);

  // Muestra un mensaje y lo oculta después de 3 segundos
  const showMessage = useCallback((type: FlashMessage['type'], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  return { message, showMessage };
}
