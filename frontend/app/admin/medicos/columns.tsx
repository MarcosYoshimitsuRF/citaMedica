'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { CellActions } from './cell-actions'; 

/**
 * DTO anidado para el consultorio.
 */
type ConsultorioInfo = {
  idConsultorio: number;
  nombre: string;
} | null;

/**
 * Define el tipo de datos para la fila de la tabla de Médicos.
 * (Coincide con MedicoResponseDTO del backend).
 */
export type MedicoDTO = {
  idMedico: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
  estaActivo: boolean;
  consultorio: ConsultorioInfo;
};

/**
 * Define la interfaz para las props del callback de edición/refresco.
 */
interface ColumnCallbacks {
    onSuccess: () => void;
    onOpenEdit: (medico: MedicoDTO) => void;
}

/**
 * Define las columnas para la DataTable de Médicos.
 */
export const getMedicoColumns = ({ onSuccess, onOpenEdit }: ColumnCallbacks): ColumnDef<MedicoDTO>[] => [
  // Columna "Nombre Completo"
  {
    accessorFn: (row) => `${row.nombres} ${row.apellidos}`,
    header: 'Nombre Completo',
  },
  
  // Columna "Especialidad"
  {
    accessorKey: 'especialidad',
    header: 'Especialidad',
  },
  
  // Columna "Consultorio Asignado"
  {
    accessorKey: 'consultorio',
    header: 'Consultorio Asignado',
    cell: ({ row }) => {
      const consultorio = row.original.consultorio;
      return consultorio ? (
        <span>{consultorio.nombre}</span>
      ) : (
        <span className="text-muted-foreground italic">No asignado</span>
      );
    },
  },

  // Columna "Estado" (Activo/Inactivo)
  {
    accessorKey: 'estaActivo',
    header: 'Estado',
    cell: ({ row }) => {
      const estaActivo = row.getValue('estaActivo');
      
      return estaActivo ? (
        <Badge variant="default">Activo</Badge>
      ) : (
        <Badge variant="destructive">Inactivo</Badge>
      );
    },
  },
  
  // Columna "Acciones" (Editar/Desactivar/Horarios)
  {
    id: 'actions', 
    cell: ({ row }) => (
      <CellActions row={row} onSuccess={onSuccess} onOpenEdit={onOpenEdit} />
    ),
  },
];