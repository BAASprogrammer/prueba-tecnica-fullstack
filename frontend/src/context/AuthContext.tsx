import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';
import { loginRequest, registerRequest, meRequest } from '../services/auth';

// Crear contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estados
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    meRequest()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Login
  const login = async (email: string, password: string) => {
    const res = await loginRequest(email, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  // Registro
  const register = async (nombre: string, email: string, password: string) => {
    const res = await registerRequest(nombre, email, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Valor del contexto
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
