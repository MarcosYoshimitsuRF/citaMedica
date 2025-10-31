'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { type CitaPacienteDTO } from './types'; 
import { CellActions } from './cell-actions';

/**
 * Define la interfaz para las props del callback.
 */
interface ColumnCallbacks {
    onSuccess: () => void;
}

/**
 * Define las columnas para la DataTable de Mis Citas.
 */
export const getPacienteCitasColumns = ({ onSuccess }: ColumnCallbacks): ColumnDef<CitaPacienteDTO>[] => [
  // Columna "Médico"
  {
    accessorFn: (row) => `Dr(a). ${row.medicoApellidos}`,
    header: 'Médico',
  },
  
  // Columna "Especialidad"
  {
    accessorKey: 'especialidad',
    header: 'Especialidad',
  },
  
  // Columna "Fecha"
  {
    accessorKey: 'fechaHora',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.original.fechaHora);
      return <span>{format(date, 'PPP')}</span>; // Ej: Oct 31, 2025
    },
  },

  // Columna "Hora"
  {
    accessorKey: 'fechaHora',
    header: 'Hora',
    cell: ({ row }) => {
      const date = new Date(row.original.fechaHora);
      return <span className="font-semibold">{format(date, 'HH:mm')}</span>; // Ej: 10:00
    },
  },
  
  // Columna "Estado"
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.original.estado;
      
      const variant = estado === 'CONFIRMADA' ? 'default' : 'destructive';
      const text = estado.replace('_', ' '); // CANCELADA PACIENTE
      
      return <Badge variant={variant} className="capitalize">{text}</Badge>;
    },
  },
  
  // Columna "Acciones" (Cancelar)
  {
    id: 'actions', 
    cell: ({ row }) => <CellActions row={row} onSuccess={onSuccess} />,
  },
];

export { CitaPacienteDTO };
