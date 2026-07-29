export interface RequestRow {
  id: number;
  numero: string;
  fecha: Date;
  tipo: string;
  descripcion: string;
  estado: string;
  clienteId: number;
  cliente_id: number;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
}

export interface RequestWithClient {
  id: number;
  number: string;
  date: Date;
  type: string;
  description: string;
  status: string;
  clientId: number;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export const mapRequestRow = (row: RequestRow): RequestWithClient => ({
  id: row.id,
  number: row.numero,
  date: row.fecha,
  type: row.tipo,
  description: row.descripcion,
  status: row.estado,
  clientId: row.clienteId,
  client: {
    id: row.cliente_id,
    name: row.cliente_nombre,
    email: row.cliente_email,
    phone: row.cliente_telefono,
  },
});
