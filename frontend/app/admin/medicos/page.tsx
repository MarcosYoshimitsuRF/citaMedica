'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Plus, Users, X } from 'lucide-react';
import { isAxiosError } from 'axios';
import api from '@/lib/api';

// Componentes propios y de Shadcn
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; // Usaremos Label simple
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// Eliminamos la importación de Form, FormField, etc.

// Tipos y columnas
import { getMedicoColumns, type MedicoDTO } from './columns';
import { type ConsultorioDTO } from '../consultorios/columns';

// --- ARQUITECTURA SIMPLIFICADA (Definiciones de Tipos) ---

/** Esquema Zod (Patrón de entrada simple) */
const medicoFormSchema = z.object({
  nombres: z.string().min(2, { message: 'El nombre es requerido.' }).max(100),
  apellidos: z.string().min(2, { message: 'El apellido es requerido.' }).max(100),
  especialidad: z.string().min(2, { message: 'La especialidad es requerida.' }).max(100),
  
  // Campo de entrada: El valor del Select será un string o null.
  idConsultorioAsignado: z
    .string()
    .nullable() // Permite 'null' del select si no hay valor
    .optional(), // Permite 'undefined' si no se selecciona nada
    
  estaActivo: z.boolean(),
});

// Tipo auxiliar para la inicialización (coincide con la entrada del formulario)
type FormFields = {
  nombres: string;
  apellidos: string;
  especialidad: string;
  idConsultorioAsignado?: string | null;
  estaActivo: boolean;
};

// Tipo de datos de SALIDA real (la conversión explícita se hace en el handler)
type MedicoAPIData = {
    nombres: string;
    apellidos: string;
    especialidad: string;
    idConsultorioAsignado: number | null; 
    estaActivo: boolean;
}

// Función para generar valores iniciales robustos
const getInitialValues = (mode: 'create' | 'edit', initialData?: MedicoDTO): FormFields => {
    const defaultValues: FormFields = {
        nombres: '',
        apellidos: '',
        especialidad: '',
        // Establecido como null para el Select
        idConsultorioAsignado: null, 
        estaActivo: true,
    };

    if (mode === 'edit' && initialData) {
        return {
            ...defaultValues,
            nombres: initialData.nombres,
            apellidos: initialData.apellidos,
            especialidad: initialData.especialidad,
            estaActivo: initialData.estaActivo,
            // Mapeo inverso: number | null -> string | null para el Select
            idConsultorioAsignado: initialData.consultorio?.idConsultorio
                ? String(initialData.consultorio.idConsultorio)
                : null, 
        };
    }
    return defaultValues;
};


// Componente principal
export default function MedicosPage() {
  const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
  const [consultorios, setConsultorios] = useState<ConsultorioDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Modal (Dialog) integrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalInitialData, setModalInitialData] = useState<MedicoDTO | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);

  // --- LÓGICA DE FETCHING ---

  const fetchMedicos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<MedicoDTO[]>('/admin/medicos');
      setMedicos(response.data);
    } catch (error) {
      toast.error('Error de carga', {
        description: 'No se pudieron cargar los datos de los médicos.',
      });
      setMedicos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchConsultorios = useCallback(async () => {
    try {
      const response = await api.get('/admin/consultorios');
      const activos = (response.data as ConsultorioDTO[]).filter(
        (c) => c.estaActivo
      );
      setConsultorios(activos);
    } catch (error) {
      toast.error('Error de carga', { description: 'No se pudieron cargar los consultorios.' });
    }
  }, []);

  useEffect(() => {
    fetchMedicos();
    fetchConsultorios();
  }, [fetchMedicos, fetchConsultorios]);


  // --- LÓGICA DEL FORMULARIO INTEGRADO (useForm) ---

  // La tipificación de useForm ahora es explícita y coincide con los campos del formulario
  const form = useForm<FormFields>({
    resolver: zodResolver(medicoFormSchema),
    defaultValues: getInitialValues('create', undefined),
  });

  // Resetear y cargar datos al abrir/cerrar el modal
  useEffect(() => {
    if (isModalOpen) {
      form.reset(getInitialValues(modalMode, modalInitialData));
    }
  }, [isModalOpen, modalMode, modalInitialData, form]);

  const handleOpenEdit = useCallback((medico: MedicoDTO) => {
    setModalMode('edit');
    setModalInitialData(medico);
    setIsModalOpen(true);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setModalMode('create');
    setModalInitialData(undefined);
    setIsModalOpen(true);
  }, []);

  /**
   * Manejador Común para el envío de datos (Create/Update)
   * Usa el registro de errores de RHF para mostrar los mensajes.
   */
  const handleValidSubmit: SubmitHandler<FormFields> = async (values) => {
    setIsPending(true);
    try {
      // --- CONVERSIÓN MANUAL DE TIPOS (La Solución) ---
      // Esta lógica se saca de Zod para eliminar el conflicto de tipado.
      const idConsultorioNum = values.idConsultorioAsignado 
        ? parseInt(values.idConsultorioAsignado, 10) 
        : null;

      const dataToSend: MedicoAPIData = {
          nombres: values.nombres,
          apellidos: values.apellidos,
          especialidad: values.especialidad,
          // Convertimos el valor de entrada del formulario (true/false o undefined) a booleano
          estaActivo: values.estaActivo ?? true, 
          idConsultorioAsignado: idConsultorioNum, // <- YA ES number | null
      }
      // --- FIN CONVERSIÓN ---

      if (modalMode === 'create') {
        await api.post('/admin/medicos', dataToSend);
        toast.success('Médico creado con éxito.');
      } else {
        const idMedico = modalInitialData?.idMedico;
        if (!idMedico) throw new Error('ID de médico faltante para la edición.');
        
        await api.put(`/admin/medicos/${idMedico}`, dataToSend);
        toast.success('Médico actualizado con éxito.');
      }
      
      // Cerrar modal y refrescar la tabla
      setIsModalOpen(false);
      fetchMedicos();
      
    } catch (error) {
      let errorMessage = 'Ocurrió un error al guardar los datos.';
      // Lógica de manejo de errores HTTP aquí...
      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { message?: string, errors?: Record<string, string> };
        errorMessage = data.message || Object.values(data.errors || {}).join(', ') || errorMessage;
      }
      toast.error('Error al guardar', { description: errorMessage });
      
    } finally {
      setIsPending(false);
    }
  };

  // --- CONFIGURACIÓN DE COLUMNAS (useMemo) ---
  const columns = useMemo(() => {
    return getMedicoColumns({
      onSuccess: fetchMedicos,
      onOpenEdit: handleOpenEdit,
    });
  }, [fetchMedicos, handleOpenEdit]);


  // --- RENDERIZADO DEL DIALOG (Modal) ---
  const formTitle = modalMode === 'create' ? 'Crear Nuevo Médico' : 'Editar Médico';

  const MedicoFormDialog = (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>

        {/* --- INICIO FORMULARIO HTML SIMPLIFICADO --- */}
        <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-4">
            
            {/* Fila 1: Nombres y Apellidos (Grid) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input 
                        id="nombres"
                        placeholder="Ej: Ana" 
                        {...form.register("nombres")} 
                        disabled={isPending} 
                        className="mt-1"
                    />
                    {form.formState.errors.nombres && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.nombres.message}</p>}
                </div>
                <div>
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input 
                        id="apellidos"
                        placeholder="Ej: Salazar" 
                        {...form.register("apellidos")} 
                        disabled={isPending} 
                        className="mt-1"
                    />
                    {form.formState.errors.apellidos && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.apellidos.message}</p>}
                </div>
            </div>

            {/* Fila 2: Especialidad */}
            <div>
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input 
                    id="especialidad"
                    placeholder="Ej: Cardiología" 
                    {...form.register("especialidad")} 
                    disabled={isPending} 
                    className="mt-1"
                />
                {form.formState.errors.especialidad && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.especialidad.message}</p>}
            </div>

            {/* Fila 3: Select de Consultorio (Usando Controller) */}
            <div>
                <Label>Consultorio Asignado</Label>
                <Controller
                    control={form.control}
                    name="idConsultorioAsignado"
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? undefined}
                            value={field.value ?? undefined}
                            disabled={isPending || consultorios.length === 0}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Seleccione un consultorio (Opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {consultorios.map((c) => (
                                    <SelectItem
                                        key={c.idConsultorio}
                                        value={String(c.idConsultorio)}
                                    >
                                        {c.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {form.formState.errors.idConsultorioAsignado && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.idConsultorioAsignado.message}</p>}
            </div>

            {/* Fila 4: 'estaActivo' (Solo visible en modo Editar) */}
            {modalMode === 'edit' && (
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <Label htmlFor="estaActivo">Estado</Label>
                    <Controller
                        control={form.control}
                        name="estaActivo"
                        render={({ field }) => (
                            <Switch
                                id="estaActivo"
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                disabled={isPending}
                            />
                        )}
                    />
                </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {modalMode === 'create' ? 'Crear Médico' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        {/* --- FIN FORMULARIO HTML SIMPLIFICADO --- */}
      </DialogContent>
    </Dialog>
  );


  // --- RENDERIZADO PRINCIPAL (Page) ---
  return (
    <>
      {MedicoFormDialog} 
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Users className="h-6 w-6" />
            <span>Gestión de Médicos</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Administra la lista de médicos, sus especialidades y consultorios asignados.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end pb-4">
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Médico
            </Button>
          </div>
          <Separator className="mb-4" />
          <DataTable
            columns={columns}
            data={medicos}
          />
        </CardContent>
      </Card>
    </>
  );
}