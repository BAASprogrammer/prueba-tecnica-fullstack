// Usuario
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  token: string;
  user: User;
}
// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}