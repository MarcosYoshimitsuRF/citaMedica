'use client';

import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Loader2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { isAxiosError } from 'axios';
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

import { type CitaPacienteDTO } from './types';

/**
 * Props para el componente de acciones de celda.
 */
interface CellActionsProps {
  row: Row<CitaPacienteDTO>;
  onSuccess: () => void; // Callback para refrescar
}

/**
 * Componente para la columna "Acciones" (Cancelar Cita Propia).
 */
export function CellActions({ row, onSuccess }: CellActionsProps) {
  const cita = row.original;
  const isCanceled = cita.estado !== 'CONFIRMADA'; // Solo se puede cancelar si está CONFIRMADA
  const [isCancelPending, setIsCancelPending] = useState(false);

  /**
   * Manejador para la confirmación de CANCELACIÓN.
   * Llama a PUT /api/citas/{id}/cancelar.
   */
  const handleCancelConfirm = async () => {
    setIsCancelPending(true);
    try {
      // Llama a la API (Segregación: el backend verifica la propiedad)
      await api.put(`/citas/${cita.idCita}/cancelar`);

      toast.success('Cita Cancelada', {
        description: `El slot se ha liberado y la cita está ahora CANCELADA.`,
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
  
  // Si la cita ya está cancelada, no mostramos el botón
  if (isCanceled) {
    return <span className="text-sm text-muted-foreground italic">No aplica</span>;
  }

  // Comprobar si la cita es pasada
  const isPast = new Date(cita.fechaHora) < new Date();
  if (isPast) {
      return <span className="text-sm text-muted-foreground italic">Finalizada</span>;
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
          <AlertDialogTitle>Confirmar Cancelación</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de cancelar su cita con el Dr(a). {cita.medicoApellidos} el día{' '}
            <span className="font-semibold">
              {format(new Date(cita.fechaHora), 'PPP')}
            </span>
            ? Esta acción liberará su slot.
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