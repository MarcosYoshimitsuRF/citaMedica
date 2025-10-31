import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Página Placeholder para el Dashboard del Admin.
 * Esta será la página principal del layout de Admin.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Bienvenido al panel de administración de Cita-Med.
      </p>

      {/* Placeholder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}