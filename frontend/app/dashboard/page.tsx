'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Página raíz para /dashboard.
 * Este componente solo redirige al usuario a la
 * página principal de paciente (/dashboard/agendar).
 */
export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página por defecto del dashboard de paciente
    router.replace('/dashboard/agendar');
  }, [router]);

  // Muestra un loader mientras la redirección ocurre
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}