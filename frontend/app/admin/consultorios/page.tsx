'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { PlusCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

// Importamos los componentes que ensamblaremos
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  getColumns, // La función que genera las columnas
  type ConsultorioDTO,
} from './columns';
import {
  ConsultorioFormDialog,
  type ConsultorioFormData, // El tipo de datos del formulario (Zod Output)
} from './form-dialog';

/**
 * Página principal para la Gestión de Consultorios (Punto 3.5.2).
 * Ensambla el botón de "Crear" y la DataTable.
 */
export default function ConsultoriosPage() {
  // Estado para los datos de la tabla
  const [data, setData] = useState<ConsultorioDTO[]>([]);
  // Estado de carga inicial
  const [isLoading, setIsLoading] = useState(true);
  // Estado de error
  const [error, setError] = useState<string | null>(null);

  /**
   * (Rol Senior) Función de Fetch/Refetch.
   * Usamos useCallback para que la función sea estable
   * y no se recree en cada render, optimizando la DataTable.
   */
  const fetchData = useCallback(async () => {
    try {
      setError(null); // Limpiar errores previos
      const response = await api.get('/admin/consultorios');
      setData(response.data);
    } catch (error) {
      console.error('Error al cargar consultorios:', error);
      setError('No se pudieron cargar los datos. Intente de nuevo.');
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []); // El array vacío asegura que la función solo se cree una vez

  // Carga inicial de datos (al montar el componente)
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Se ejecuta una vez

  /**
   * (Rol Senior) Memoización de las columnas.
   * La función 'getColumns' se llama solo si 'fetchData' cambia.
   * Esto previene que la DataTable se re-renderice innecesariamente.
   */
  const columns = useMemo(() => getColumns(fetchData), [fetchData]);

  /**
   * Manejador para el formulario de CREACIÓN.
   * Esta función se pasa al FormDialog de "Crear".
   */
  const handleCreateSubmit = async (
    values: ConsultorioFormData
  ): Promise<boolean> => {
    try {
      await api.post('/admin/consultorios', values);
      
      fetchData(); // <-- Refresca la tabla
      return true; // Éxito (cierra el modal)
      
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const validationErrors = error.response.data as Record<string, string>;
        toast.error('Error al crear', {
          description: Object.values(validationErrors).join(', '),
        });
      } else {
        toast.error('Error inesperado', {
          description: 'No se pudo crear el consultorio.',
        });
      }
      return false; // Fracaso (mantiene el modal abierto)
    }
  };

  // ----- RENDERIZADO -----

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="mb-4 text-destructive">{error}</p>
        <Button onClick={fetchData}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera de la página y Botón "Crear" */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Consultorios</h1>
          <p className="text-muted-foreground">
            Crear, editar y desactivar los consultorios del sistema.
          </p>
        </div>

        {/* Botón "+ Crear Consultorio" que abre el Diálogo/Formulario */}
        <ConsultorioFormDialog
          mode="create"
          onSubmit={handleCreateSubmit}
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Consultorio
            </Button>
          }
        />
      </div>

      {/* La Tabla de Datos */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}