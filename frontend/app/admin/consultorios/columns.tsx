'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

// Importamos el componente de acciones
import { CellActions } from './cell-actions';

export type ConsultorioDTO = {
  idConsultorio: number;
  nombre: string;
  ubicacion: string | null;
  estaActivo: boolean;
};

/**
 * Define las columnas para la DataTable de Consultorios.
 * (CORREGIDO: Convertido a una función 'getColumns'
 * para poder inyectar el callback 'onSuccess').
 */
export const getColumns = (
  onSuccess: () => void // <-- CORRECCIÓN: Acepta el callback de refresco
): ColumnDef<ConsultorioDTO>[] => [
  // Columna "Nombre"
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  
  // Columna "Ubicación"
  {
    accessorKey: 'ubicacion',
    header: 'Ubicación',
    cell: ({ row }) => {
      const ubicacion = row.getValue('ubicacion');
      return ubicacion ? (
        <span>{String(ubicacion)}</span>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
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
  
  // Columna "Acciones" (Editar/Desactivar)
  {
    id: 'actions', // ID único para la columna
    cell: ({ row }) => (
      // <-- CORRECCIÓN: Pasa el callback a CellActions
      <CellActions row={row} onSuccess={onSuccess} />
    ),
  },
];