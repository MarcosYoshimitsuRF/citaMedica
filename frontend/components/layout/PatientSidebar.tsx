'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Utilidad de Shadcn
import { Button } from '@/components/ui/button';
import { CalendarPlus, CalendarCheck2 } from 'lucide-react'; // Iconos

/**
 * Define los enlaces de navegación para el Paciente.
 */
const patientNavLinks = [
  {
    href: '/dashboard/agendar',
    label: 'Agendar Cita',
    icon: CalendarPlus,
  },
  {
    href: '/dashboard/mis-citas',
    label: 'Mis Citas',
    icon: CalendarCheck2,
  },
];

/**
 * Componente Sidebar persistente para el layout de Paciente.
 */
export default function PatientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Título/Logo del Sidebar */}
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard/agendar"
          className="text-lg font-bold text-primary"
        >
          Cita-Med
        </Link>
      </div>

      {/* Contenedor de la Navegación */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {patientNavLinks.map((link) => {
            // Comprueba si el enlace es el activo
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Button
                  asChild // Permite que el Button actúe como un Link
                  variant={isActive ? 'secondary' : 'ghost'} // Resaltado
                  className="w-full justify-start"
                >
                  <Link href={link.href}>
                    <Icon className="mr-3 h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}