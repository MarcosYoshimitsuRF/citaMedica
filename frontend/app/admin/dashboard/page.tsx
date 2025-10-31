'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, Clock, CalendarCheck2 } from 'lucide-react';
import api from '@/lib/api';

// Componentes propios y de Shadcn
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CitaAdminDTO } from '@/app/dashboard/mis-citas/types';
import { getAdminCitasColumns } from './columns';
import { Button } from '@/components/ui/button';

// Tipos y columnas


/**
 * Página principal del Dashboard del Admin (Punto 5.3.5).
 * Muestra el listado global de todas las citas.
 */
export default function AdminDashboardPage() {
  const [citas, setCitas] = useState<CitaAdminDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Función de Fetch/Refetch (Recarga los datos de la tabla).
   */
  const fetchCitas = useCallback(async () => {
    setIsLoading(true);
    try {
      // Llama a GET /api/admin/citas/todas
      const response = await api.get<CitaAdminDTO[]>('/admin/citas/todas');
      setCitas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setError('No se pudo cargar el historial global de citas.');
      toast.error('Error de carga');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // Memoización de las columnas
  const columns = useMemo(() => getAdminCitasColumns({ onSuccess: fetchCitas }), [fetchCitas]);


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
          <span>Panel de Gestión de Citas (Todas las Citas)</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Historial completo de agendamiento, incluyendo citas canceladas.
        </p>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <DataTable
          columns={columns}
          data={citas}
        />
        {citas.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
            <Clock className="h-10 w-10 mb-2" />
            <p>No hay citas registradas en el sistema.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}