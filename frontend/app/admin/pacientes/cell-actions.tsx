'use client';

import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Loader2, Edit, Trash2 } from 'lucide-react';
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
import { type PacienteDTO } from './columns';

/**
 * Props para el componente de acciones de celda.
 */
interface CellActionsProps {
  row: Row<PacienteDTO>;
  onSuccess: () => void; // Callback para refrescar datos
  onOpenEdit: (paciente: PacienteDTO) => void; 
}

/**
 * Componente para la columna "Acciones" (Editar, Desactivar).
 */
export function CellActions({ row, onSuccess, onOpenEdit }: CellActionsProps) {
  const paciente = row.original;
  
  const [isDeletePending, setIsDeletePending] = useState(false);

  /**
   * Manejador para la confirmación de DESACTIVACIÓN (Soft Delete).
   * Llama a DELETE /api/admin/pacientes/{id}.
   */
  const handleDeleteConfirm = async () => {
    setIsDeletePending(true);
    try {
      // Soft Delete: Llama al SP que pone esta_activo = 0 en Usuarios
      await api.delete(`/admin/pacientes/${paciente.idPaciente}`);

      toast.success('Cuenta desactivada con éxito.', {
          description: `El login de ${paciente.email} ha sido bloqueado.`,
      });
      
      onSuccess(); // <--- CORRECCIÓN: Llamamos a la función de recarga
      
    } catch (error) {
      console.error('Error al desactivar paciente:', error);
      toast.error('Error inesperado', {
        description: 'No se pudo desactivar la cuenta. Intente de nuevo.',
      });
    } finally {
      setIsDeletePending(false);
    }
  };
  
  return (
    <div className="flex space-x-2">
      
      {/* Botón 1: Editar (Llama al callback de la PAGE) */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 p-1.5"
        onClick={() => onOpenEdit(paciente)}
        title="Editar Datos"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Botón 2: Desactivar (AlertDialog) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 p-1.5 text-destructive hover:text-destructive/80"
            title="Desactivar Cuenta"
            disabled={!paciente.estaActivo} // Solo se puede desactivar si está activo
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desactivación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de desactivar la cuenta del paciente{' '}
              <span className="font-semibold">
                {paciente.nombres} {paciente.apellidos}
              </span>
              ? El paciente no podrá iniciar sesión.
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
              Sí, Desactivar Cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}