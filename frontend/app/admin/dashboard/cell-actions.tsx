'use client';

import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Loader2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';

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
import { CitaAdminDTO } from '@/app/dashboard/mis-citas/types';


/**
 * Props para el componente de acciones de celda (Admin).
 */
interface CellActionsProps {
  row: Row<CitaAdminDTO>;
  onSuccess: () => void; // Callback para refrescar
}

/**
 * Componente para la columna "Acciones" (Cancelar Cita por Admin).
 */
export function CellActions({ row, onSuccess }: CellActionsProps) {
  const cita = row.original;
  const isCanceled = cita.estado !== 'CONFIRMADA'; // Solo se puede cancelar si está CONFIRMADA
  const [isCancelPending, setIsCancelPending] = useState(false);

  /**
   * Manejador para la confirmación de CANCELACIÓN (Admin).
   * Llama a PUT /api/admin/citas/{id}/cancelar.
   */
  const handleCancelConfirm = async () => {
    setIsCancelPending(true);
    try {
      // Llama a la API para cancelar la cita (estado: CANCELADA_ADMIN)
      await api.put(`/admin/citas/${cita.idCita}/cancelar`);

      toast.success('Cita Cancelada por Admin', {
        description: `El slot se ha liberado para el Dr(a). ${cita.medicoApellidos}.`,
      });
      onSuccess(); // Refresca la tabla y el Slot Generator
      
    } catch (error) {
      toast.error('Error al Cancelar', {
        description: 'No se pudo cancelar la cita. Intente de nuevo.',
      });
    } finally {
      setIsCancelPending(false);
    }
  };
  
  // Si la cita ya está cancelada o es pasada, no mostramos el botón
  if (isCanceled || new Date(cita.fechaHora) < new Date()) {
    return <span className="text-sm text-muted-foreground italic">No aplica</span>;
  }

  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="h-8"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Cancelación (Admin)</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de cancelar la cita de{' '}
            <span className="font-semibold">{cita.pacienteNombres}</span> con el Dr(a). {cita.medicoApellidos} el día{' '}
            <span className="font-semibold">
              {format(new Date(cita.fechaHora), 'PPP')}
            </span>
            ? El estado será CANCELADA_ADMIN.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelPending}>
            Volver
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelConfirm}
            disabled={isCancelPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isCancelPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sí, Cancelar Cita
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}