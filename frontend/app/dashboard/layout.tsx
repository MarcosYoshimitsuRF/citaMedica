'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

// Importamos los componentes de layout que creamos
import PatientSidebar from '@/components/layout/PatientSidebar';
import Header from '@/components/layout/Header';
import { Loader2 } from 'lucide-react'; // Para el estado de carga

/**
 * Layout Guardián (Punto 2.3.3) y Lógica de Protección (Punto 2.3.4)
 * (CORREGIDO para evitar bucle infinito en el selector de Zustand)
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  // --- INICIO DE LA CORRECCIÓN (Problema del Loop) ---
  // Seleccionamos cada valor individualmente.
  // Esto previene que el hook 'useAuthStore' cree un objeto nuevo
  // en cada render, lo que causaba el bucle infinito.
  const rol = useAuthStore((state) => state.rol);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrate = useAuthStore((state) => state.hydrate);
  // --- FIN DE LA CORRECCIÓN ---

  // 2. Estado local para saber si la hidratación ya se ejecutó
  const [isHydrated, setIsHydrated] = useState(false);

  // 3. (PASO 1) Efecto de Hidratación (Corregido)
  useEffect(() => {
    hydrate();
    // Usamos el patrón de Promise que acordamos
    Promise.resolve().then(() => setIsHydrated(true));
  }, [hydrate]); 

  // 4. (PASO 2) Lógica de Guardián (Se ejecuta en cada render)
  
  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace('/login');
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (rol !== 'PACIENTE') {
    router.replace('/admin/dashboard');
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 5. (PASO 3) Éxito: Es Paciente y está autenticado.
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40">
      <PatientSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}