// Datos simulados de API externa
const externalClients: Array<{ rut: string; name: string; email: string; phone: string; }> = [
  { rut: '12345678-9', name: 'Carlos Muñoz', email: 'carlos.munoz@example.com', phone: '+56912345678' },
  { rut: '98765432-1', name: 'María González', email: 'maria.gonzalez@example.com', phone: '+56987654321' },
  { rut: '11111111-1', name: 'Pedro López', email: 'pedro.lopez@example.com', phone: '+56911111111', },
  { rut: '22222222-2', name: 'Ana Martínez', email: 'ana.martinez@example.com', phone: '+56922222222' },
  { rut: '33333333-3', name: 'Diego Soto', email: 'diego.soto@example.com', phone: '+56933333333' },
];

// Simula el consumo de una API externa de búsqueda de clientes por RUT o email
export async function searchExternalAPI(query: string, signal?: AbortSignal): Promise<{
  rut: string; name: string; email: string; phone: string;
}> {
  // Tiempo de respuesta simulado (300-900 ms)
  const delay = 300 + Math.random() * 600;

  // Simula timeout si el delay supera 800ms (para demostrar manejo de timeout) - lanzará error si el usuario cancela
  await new Promise<void>((resolve, reject) => {
    // Timer para simular timeout
    const timer = setTimeout(resolve, delay);
    // Si el usuario cancela, se ejecuta el reject
    if (signal) {
      signal.addEventListener('abort', () => {
        // Limpia el timer
        clearTimeout(timer);
        // Rechaza la promesa con un error de timeout
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });

  // Busca coincidencia por RUT o email
  const found = externalClients.find(
    (c) => c.rut === query || c.email.toLowerCase() === query.toLowerCase()
  );
  // Si no se encuentra el cliente, lanza error
  if (!found) {
    const err = new Error('Cliente no encontrado en API externa');
    (err as any).status = 404;
    throw err;
  }

  return found;
}
