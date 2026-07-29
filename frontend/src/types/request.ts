export interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface RequestItem {
  id: number;
  number: string;
  date: string;
  type: string;
  description: string;
  status: string;
  clientId: number;
  client: ClientInfo;
}
