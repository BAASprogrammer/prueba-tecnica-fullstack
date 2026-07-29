import { useAuth } from '../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export default function Dashboard() {
  //Hook para acceder al contexto de autenticacion
  const { user, logout } = useAuth();

  //Renderizar el panel principal
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Panel Principal</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              {user?.nombre} ({user?.email})
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesion
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Bienvenido, {user?.nombre}!
          </h2>
          <p className="text-gray-600">
            Has iniciado sesion correctamente. Esta es un area protegida.
          </p>
        </div>
      </main>
    </div>
  );
}
