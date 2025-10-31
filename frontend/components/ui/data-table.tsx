'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react'; // Importación necesaria
import { Input } from './input';

/**
 * Props para el componente genérico de DataTable.
 * AÑADIDA: Prop isLoading para manejar el estado de carga.
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean; // <-- CORRECCIÓN 1: Propiedad añadida
  filterColumnId?: string; // <-- Propiedad de filtro (usada en el page.tsx)
  filterPlaceholder?: string; // <-- Propiedad de filtro (usada en el page.tsx)
}

/**
 * Componente genérico y reutilizable de DataTable.
 * (Actualizado para mostrar loader y manejar filtro básico).
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false, // <-- CORRECCIÓN 2: Valor por defecto
  filterColumnId,
  filterPlaceholder,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Si está cargando, se muestra una fila de loader
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {/* SECCIÓN DE FILTRO (No pedida, pero necesaria para la prop filterColumnId) */}
      {filterColumnId && (
        <div className="flex items-center py-4 px-4">
          <Input
            placeholder={filterPlaceholder || `Buscar...`}
            value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      
      <Table>
        {/* Cabecera de la Tabla */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Cuerpo de la Tabla */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Mensaje si no hay datos
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}