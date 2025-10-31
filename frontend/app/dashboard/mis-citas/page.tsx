'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { CalendarCheck2, Loader2, History } from 'lucide-react';
import api from '@/lib/api';

// Componentes propios y de Shadcn
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Tipos y columnas
import { Button } from '@/components/ui/button';
import { CitaPacienteDTO } from './types';
import { getPacienteCitasColumns } from './columns';


/**
 * Página principal para Mis Citas (Punto 5.3.1).
 * Muestra el historial y citas futuras del paciente logueado.
 */
export default function MisCitasPage() {
  const [citas, setCitas] = useState<CitaPacienteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Función de Fetch/Refetch (Recarga los datos de la tabla).
   */
  const fetchCitas = useCallback(async () => {
    setIsLoading(true);
    try {
      // Llamada a GET /api/citas/mis-citas (con Segregación de Datos)
      const response = await api.get<CitaPacienteDTO[]>('/citas/mis-citas');
      setCitas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setError('No se pudo cargar su historial de citas.');
      toast.error('Error de carga de historial');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // Memoización de las columnas
  const columns = useMemo(() => getPacienteCitasColumns({ onSuccess: fetchCitas }), [fetchCitas]);


  // --- RENDERIZADO ---

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="mb-4 text-destructive">{error}</p>
        <Button onClick={fetchCitas}>Reintentar Carga</Button>
      </div>
    );
  }


  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <CalendarCheck2 className="h-6 w-6" />
          <span>Mis Citas Agendadas</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Historial de citas y gestión de cancelaciones.
        </p>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <DataTable
          columns={columns}
          data={citas}
          filterColumnId="medicoApellidos"
          filterPlaceholder="Buscar por médico..."
        />
        {citas.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
            <History className="h-10 w-10 mb-2" />
            <p>No tienes citas agendadas.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}