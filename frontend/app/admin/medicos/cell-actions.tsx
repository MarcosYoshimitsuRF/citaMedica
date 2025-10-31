'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Loader2, CalendarDays, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';

// Shadcn Components
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Tipos de datos
import { type MedicoDTO } from './columns';

/**
 * Props para el componente de acciones de celda.
 */
interface CellActionsProps {
  row: Row<MedicoDTO>;
  onSuccess: () => void; 
  onOpenEdit: (medico: MedicoDTO) => void; 
}

/**
 * Componente para la columna "Acciones" (Editar, Desactivar, Horarios).
 */
export function CellActions({ row, onSuccess, onOpenEdit }: CellActionsProps) {
  const router = useRouter();
  const medico = row.original;
  
  const [isDeletePending, setIsDeletePending] = useState(false);

  /**
   * Manejador para la confirmación de DESACTIVACIÓN (Soft Delete).
   */
  const handleDeleteConfirm = async () => {
    setIsDeletePending(true);
    try {
      await api.delete(`/admin/medicos/${medico.idMedico}`);

      toast.success('Médico desactivado con éxito.');
      onSuccess(); // Refresca la tabla
      
    } catch (error) {
      console.error('Error al desactivar médico:', error);
      toast.error('Error inesperado', {
        description: 'No se pudo desactivar el médico.',
      });
    } finally {
      setIsDeletePending(false);
    }
  };
  
  /**
   * Redirige a la página de gestión de horarios.
   */
  const handleGoToSchedule = () => {
    router.push(`/admin/medicos/${medico.idMedico}/horarios`);
  }

  return (
    <div className="flex space-x-2">
      {/* Botón 1: Gestionar Horarios */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleGoToSchedule}
        className="h-8"
      >
        <CalendarDays className="mr-1 h-4 w-4" />
        Horarios
      </Button>
      
      {/* Botón 2: Editar (Llama al callback de la PAGE) */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 p-1.5"
        onClick={() => onOpenEdit(medico)}
        title="Editar Médico"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Botón 3: Desactivar (AlertDialog) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 p-1.5 text-destructive hover:text-destructive/80"
            title="Desactivar Médico"
            disabled={medico.idMedico === undefined}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desactivación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de desactivar al Dr(a).{' '}
              <span className="font-semibold">
                {medico.nombres} {medico.apellidos}
              </span>
              ? (Esto es un Soft Delete y no borrará sus citas pasadas).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeletePending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeletePending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sí, Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}