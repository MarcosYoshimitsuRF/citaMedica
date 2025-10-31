'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

/**
 * Componente Header persistente para los layouts de Admin y Paciente.
 * Muestra el rol del usuario y el botón de "Cerrar Sesión".
 */
export default function Header() {
  const router = useRouter();

  // Seleccionamos las acciones y el estado del store
  const logoutAction = useAuthStore((state) => state.logout);
  const hydrate = useAuthStore((state) => state.hydrate);
  const rol = useAuthStore((state) => state.rol);

  // Hidratar el store en la montura para obtener el 'rol'
  // (Evita que el rol aparezca vacío en el primer render)
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  /**
   * Manejador para el clic en "Cerrar Sesión".
   * Llama a la acción de logout y redirige al login.
   */
  const handleLogout = () => {
    logoutAction();
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Saludo al usuario basado en el rol */}
      <div>
        {rol && (
          <span className="text-sm font-medium text-muted-foreground">
            Bienvenido,{' '}
            <span className="font-semibold text-primary">
              {rol === 'ADMIN' ? 'Administrador' : 'Paciente'}
            </span>
          </span>
        )}
      </div>

      {/* Botón de Cerrar Sesión */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </header>
  );
}