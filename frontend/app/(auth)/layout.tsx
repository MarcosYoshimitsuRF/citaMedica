import React from 'react';

/**
 * Layout compartido para las rutas de autenticación (Login y Registro).
 * Proporciona un fondo y centra el contenido en la pantalla.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Contenedor principal que centra el formulario
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      {children}
    </main>
  );
}