import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Página Placeholder para "Agendar Cita" del Paciente.
 * Esta será la página principal del layout de Paciente.
 */
export default function AgendarCitaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Agendar Cita</h1>
      <p className="text-muted-foreground">
        Bienvenido a tu panel de agendamiento.
      </p>

      {/* Placeholder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Próximamente (FASE 4: Slot Generator)</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}