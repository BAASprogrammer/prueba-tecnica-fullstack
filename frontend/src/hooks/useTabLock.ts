import { useState, useEffect, useCallback, useRef } from 'react';

const CHANNEL = 'solicitudes-lock';

interface LockMessage {
  type: 'create' | 'edit';
  id?: number;
  action: 'lock' | 'unlock' | 'sync';
  tabId: string;
}

let TAB_ID: string;
function getTabId() {
  if (!TAB_ID) {
    TAB_ID = crypto.randomUUID();
  }
  return TAB_ID;
}
// Bloquea la creacion y edicion de solicitudes entre pestañas
export function useTabLock() {
  const [lockedCreate, setLockedCreate] = useState(false);
  const [lockedEditIds, setLockedEditIds] = useState<Set<number>>(new Set());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const myLocks = useRef<Set<string>>(new Set());
  // Detecta cambios en otras pestañas mediante BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    const tabId = getTabId();
    // Maneja mensajes de otras pestañas
    const handleMessage = (event: MessageEvent<LockMessage>) => {
      // Ignora mensajes de la misma pestaña
      const msg = event.data;
      if (msg.tabId === tabId) return;
      // Actualiza estados según el mensaje recibido
      if (msg.action === 'lock') {
        // Bloquea creación o edición según el tipo
        if (msg.type === 'create') {
          setLockedCreate(true);
        } else if (msg.type === 'edit' && msg.id) {
          setLockedEditIds((prev) => new Set(prev).add(msg.id!));
        }
      } else if (msg.action === 'unlock') {
        // Libera creación o edición según el tipo
        if (msg.type === 'create') {
          setLockedCreate(false);
        } else if (msg.type === 'edit' && msg.id) {
          setLockedEditIds((prev) => {
            const next = new Set(prev);
            next.delete(msg.id!);
            return next;
          });
        }
      } else if (msg.action === 'sync') {
        // Sincroniza bloqueos activos
        for (const key of myLocks.current) {
          const [type, id] = key.split(':');
          channel.postMessage({
            type: type as 'create' | 'edit',
            id: id ? Number(id) : undefined,
            action: 'lock',
            tabId,
          });
        }
      }
    };

    channel.addEventListener('message', handleMessage);

    // Pide a otras pestañas que reporten sus bloqueos activos
    channel.postMessage({ type: 'create', action: 'sync', tabId });

    // Limpia el bloqueo cuando la pestaña se cierra
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  // Libera bloqueos al cerrar la pestaña
  useEffect(() => {
    const tabId = getTabId();
    const handleUnload = () => {
      for (const key of myLocks.current) {
        const [type, id] = key.split(':');
        channelRef.current?.postMessage({
          type: type as 'create' | 'edit',
          id: id ? Number(id) : undefined,
          action: 'unlock',
          tabId,
        });
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const acquireLock = useCallback((type: 'create' | 'edit', id?: number) => {
    const key = id ? `${type}:${id}` : `${type}:`;
    myLocks.current.add(key);
    channelRef.current?.postMessage({ type, id, action: 'lock', tabId: getTabId() });
  }, []);

  const releaseLock = useCallback((type: 'create' | 'edit', id?: number) => {
    const key = id ? `${type}:${id}` : `${type}:`;
    myLocks.current.delete(key);
    channelRef.current?.postMessage({ type, id, action: 'unlock', tabId: getTabId() });
  }, []);

  return { lockedCreate, lockedEditIds, acquireLock, releaseLock };
}
