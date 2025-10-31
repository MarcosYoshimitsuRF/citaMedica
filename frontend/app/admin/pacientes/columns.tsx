'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { CellActions } from './cell-actions'; 

/**
 * Define el tipo de datos para la fila de la tabla de Pacientes.
 * (Coincide con PacienteResponseDTO del backend).
 */
export type PacienteDTO = {
  idPaciente: number;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  email: string;
  estaActivo: boolean; // Estado de la cuenta de Usuario
};

/**
 * Define la interfaz para las props del callback.
 */
interface ColumnCallbacks {
    onSuccess: () => void;
    onOpenEdit: (paciente: PacienteDTO) => void;
}

/**
 * Define las columnas para la DataTable de Pacientes.
 */
export const getPacienteColumns = ({ onSuccess, onOpenEdit }: ColumnCallbacks): ColumnDef<PacienteDTO>[] => [
  // Columna "Nombre Completo"
  {
    accessorFn: (row) => `${row.nombres} ${row.apellidos}`,
    header: 'Nombre Completo',
  },
  
  // Columna "DNI"
  {
    accessorKey: 'dni',
    header: 'DNI',
  },
  
  // Columna "Email"
  {
    accessorKey: 'email',
    header: 'Email',
  },
  
  // Columna "Teléfono"
  {
    accessorKey: 'telefono',
    header: 'Teléfono',
    cell: ({ row }) => {
        const telefono = row.getValue('telefono');
        return telefono ? <span>{String(telefono)}</span> : <span className="text-muted-foreground italic">N/A</span>;
    },
  },

  // Columna "Estado de Cuenta" (Activo/Inactivo)
  {
    accessorKey: 'estaActivo',
    header: 'Estado',
    cell: ({ row }) => {
      const estaActivo = row.getValue('estaActivo');
      
      return estaActivo ? (
        <Badge variant="default">Activo</Badge>
      ) : (
        <Badge variant="destructive">Desactivado</Badge>
      );
    },
  },
  
  // Columna "Acciones" (Editar/Desactivar)
  {
    id: 'actions', 
    cell: ({ row }) => (
      // Asume que CellActions existe en la misma carpeta e importa PacienteDTO localmente
      <CellActions row={row} onSuccess={onSuccess} onOpenEdit={onOpenEdit} />
    ),
  },
];