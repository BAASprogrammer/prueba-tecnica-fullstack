import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
//Hook para acceder al contexto de autenticacion
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  //si no hay contexto lanzar error
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  //devolver el contexto
  return ctx;
};
