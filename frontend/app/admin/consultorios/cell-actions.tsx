'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // <-- CORRECCIÓN: Ya no se usa
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { MoreHorizontal, Loader2, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';

// Shadcn Components
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Importamos el formulario y el tipo de datos validado
import {
  ConsultorioFormDialog,
  type ConsultorioFormData,
} from './form-dialog';
import { type ConsultorioDTO } from './columns';

/**
 * Props para el componente de acciones de celda.
 */
interface CellActionsProps {
  row: Row<ConsultorioDTO>;
  onSuccess: () => void; // <-- CORRECCIÓN: Callback para refrescar
}

/**
 * Componente para la columna "Acciones" (Corregido).
 */
export function CellActions({ row, onSuccess }: CellActionsProps) {
  // const router = useRouter(); // <-- CORRECCIÓN: Ya no se usa
  const consultorio = row.original;

  const [isEditPending, setIsEditPending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  /**
   * Manejador para el formulario de EDICIÓN.
   */
  const handleEditSubmit = async (
    values: ConsultorioFormData
  ): Promise<boolean> => {
    setIsEditPending(true);
    try {
      await api.put(`/admin/consultorios/${consultorio.idConsultorio}`, values);
      
      onSuccess(); // <-- CORRECCIÓN: Llama al callback
      return true; // Éxito (cierra el modal)
      
    } catch (error) { // 'error' es 'unknown'
      let errorMessage = 'No se pudo actualizar el consultorio.';
      if (
        isAxiosError(error) &&
        error.response?.data &&
        typeof error.response.data === 'object'
      ) {
        const validationErrors = error.response.data as Record<string, string>;
        errorMessage = Object.values(validationErrors).join(', ');
      }
      toast.error('Error al editar', {
        description: errorMessage,
      });
      return false; // Fracaso (mantiene el modal abierto)
    } finally {
      setIsEditPending(false);
    }
  };

  /**
   * Manejador para la confirmación de DESACTIVACIÓN.
   */
  const handleDeleteConfirm = async () => {
    setIsDeletePending(true);
    try {
      await api.delete(`/admin/consultorios/${consultorio.idConsultorio}`);
      
      toast.success('Consultorio desactivado con éxito.');
      onSuccess(); // <-- CORRECCIÓN: Llama al callback
      setIsDeleteAlertOpen(false);
      
    } catch (error) {
      toast.error('Error inesperado', {
        description: 'No se pudo desactivar el consultorio.',
      });
    } finally {
      setIsDeletePending(false);
    }
  };

  // ... (El JSX del DropdownMenu y AlertDialog es idéntico)
  return (
    <>
      {/* Botón de Acciones (Dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Opción 1: Editar (Abre el FormDialog) */}
          <ConsultorioFormDialog
            mode="edit"
            initialData={consultorio}
            onSubmit={handleEditSubmit}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            }
          />

          {/* Opción 2: Desactivar (Abre el AlertDialog) */}
          <DropdownMenuItem
            onSelect={() => setIsDeleteAlertOpen(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Desactivar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de Confirmación para Desactivar (oculto por defecto) */}
      <AlertDialog
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará el consultorio{' '}
              <span className="font-semibold">{consultorio.nombre}</span>.
              (Soft Delete).
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
              Confirmar Desactivación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}