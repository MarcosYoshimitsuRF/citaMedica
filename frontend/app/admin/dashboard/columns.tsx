'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CitaAdminDTO } from '@/app/dashboard/mis-citas/types';
import { CellActions } from './cell-actions';

/**
 * Define la interfaz para las props del callback.
 */
interface ColumnCallbacks {
    onSuccess: () => void;
}

/**
 * Define las columnas para la DataTable de Todas las Citas (Admin).
 */
export const getAdminCitasColumns = ({ onSuccess }: ColumnCallbacks): ColumnDef<CitaAdminDTO>[] => [
  // Columna "Fecha y Hora"
  {
    accessorKey: 'fechaHora',
    header: 'Fecha y Hora',
    cell: ({ row }) => {
      const date = new Date(row.original.fechaHora);
      return (
        <div className="font-semibold">
          {format(date, 'MMM d, yyyy')} <br />
          <span className="text-primary">{format(date, 'hh:mm a')}</span>
        </div>
      );
    },
  },
  
  // Columna "Médico"
  {
    accessorFn: (row) => `Dr(a). ${row.medicoApellidos}`,
    header: 'Médico (Especialidad)',
    cell: ({ row }) => (
      <div>
        <span className="font-medium">Dr(a). {row.original.medicoApellidos}</span>
        <br />
        <span className="text-xs text-muted-foreground">{row.original.especialidad}</span>
      </div>
    ),
  },
  
  // Columna "Paciente"
  {
    accessorFn: (row) => row.pacienteNombres,
    header: 'Paciente (DNI/Email)',
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.pacienteNombres} {row.original.pacienteApellidos}</span>
        <br />
        <span className="text-xs text-muted-foreground">{row.original.pacienteEmail}</span>
      </div>
    ),
  },

  // Columna "Estado"
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.original.estado;
      
      let variant: 'default' | 'destructive' | 'secondary' = 'default';
      if (estado.includes('CANCELADA')) {
          variant = 'destructive';
      } else if (estado === 'CONFIRMADA') {
          variant = 'default';
      }
      
      const text = estado.replace('_', ' ');
      
      return <Badge variant={variant} className="capitalize">{text}</Badge>;
    },
  },
  
  // Columna "Acciones" (Cancelar Admin)
  {
    id: 'actions', 
    cell: ({ row }) => <CellActions row={row} onSuccess={onSuccess} />,
  },
];