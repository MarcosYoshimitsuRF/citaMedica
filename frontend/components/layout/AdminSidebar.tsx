'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Utilidad de Shadcn para clases condicionales
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building,
} from 'lucide-react'; // Iconos para un diseño profesional

/**
 * Define los enlaces de navegación para el Administrador.
 */
const adminNavLinks = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/medicos',
    label: 'Gestión de Médicos',
    icon: Stethoscope,
  },
  {
    href: '/admin/pacientes',
    label: 'Gestión de Pacientes',
    icon: Users,
  },
  {
    href: '/admin/consultorios',
    label: 'Gestión de Consultorios',
    icon: Building,
  },
];

/**
 * Componente Sidebar persistente para el layout de Admin.
 * Muestra los enlaces de navegación del administrador.
 */
export default function AdminSidebar() {
  // Hook para obtener la ruta actual (ej. /admin/medicos)
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Título/Logo del Sidebar */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="text-lg font-bold text-primary">
          Cita-Med [Admin]
        </Link>
      </div>

      {/* Contenedor de la Navegación */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {adminNavLinks.map((link) => {
            // Comprueba si el enlace es el activo (o una sub-ruta)
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