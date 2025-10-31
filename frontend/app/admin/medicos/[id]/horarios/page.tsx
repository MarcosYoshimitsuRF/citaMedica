'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, CalendarDays, ArrowLeft } from 'lucide-react';
import { isAxiosError } from 'axios';
import api from '@/lib/api';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DialogFooter } from '@/components/ui/dialog';

// Tipos de datos
interface HorarioDTO {
  idHorario?: number;
  idMedico: number;
  diaSemana: number; // 1=Lunes, 7=Domingo
  horaInicio: string; // Formato TIME (HH:mm:ss)
  horaFin: string;    // Formato TIME (HH:mm:ss)
  estaActivo: boolean;
}

// Mapa de días de la semana para la UI
const DÍAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' },
];

/**
 * Esquema Zod de validación del formulario de horarios (solo verifica formato y presencia).
 * La validación de negocio (horaInicio < horaFin) ocurre en el Service del Backend.
 */
const horarioFormSchema = z.object({
  // Mapeamos un objeto donde la clave es el ID del día y el valor es el rango.
  horarios: z.record(
    z.string().regex(/^[1-7]$/), // Clave: 1, 2, 3...
    z.object({
      // Ambos campos deben existir si el día está en el formulario
      horaInicio: z.string().optional().nullable(),
      horaFin: z.string().optional().nullable(),
    }).optional()
  ),
});

type FormFields = z.infer<typeof horarioFormSchema>;

/**
 * Página de Gestión de Horarios de un Médico específico (Punto 3.5.5).
 */
export default function HorariosMedicoPage() {
  const router = useRouter();
  const params = useParams();
  const idMedico = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [currentHorarios, setCurrentHorarios] = useState<HorarioDTO[]>([]);

  const form = useForm<FormFields>({
    resolver: zodResolver(horarioFormSchema),
    defaultValues: { horarios: {} },
  });

  /**
   * Mapea los horarios de la API a un formato de formulario.
   */
  const mapApiToForm = useCallback((apiHorarios: HorarioDTO[]) => {
    const formValues: FormFields = { horarios: {} };
    apiHorarios.forEach((h) => {
      formValues.horarios[String(h.diaSemana)] = {
        horaInicio: h.horaInicio.substring(0, 5), // 'HH:mm'
        horaFin: h.horaFin.substring(0, 5),       // 'HH:mm'
      };
    });
    form.reset(formValues);
    setCurrentHorarios(apiHorarios);
  }, [form]);

  /**
   * Carga los horarios existentes del médico.
   */
  const fetchHorarios = useCallback(async () => {
    if (!idMedico) return;
    setIsLoading(true);
    try {
      // Llamada a GET /api/admin/horarios?medicoId={id} (Punto 3.5.7)
      const response = await api.get<HorarioDTO[]>(`/admin/horarios`, {
        params: { medicoId: idMedico },
      });
      mapApiToForm(response.data);
    } catch (error) {
      toast.error('Error', { description: 'No se pudieron cargar los horarios existentes.' });
      mapApiToForm([]);
    } finally {
      setIsLoading(false);
    }
  }, [idMedico, mapApiToForm]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  /**
   * Maneja el envío del formulario (Guardar).
   */
  const handleValidSubmit: SubmitHandler<FormFields> = async (values) => {
    setIsPending(true);
    try {
      const horariosToSave = [];
      const horariosToDelete: number[] = [];

      // 1. Procesar los 7 días de la semana
      for (const day of DÍAS_SEMANA) {
        const key = String(day.id);
        const input = values.horarios[key];
        const current = currentHorarios.find((h) => h.diaSemana === day.id);

        const inicio = input?.horaInicio || null;
        const fin = input?.horaFin || null;
        
        // Caso 1: Rango Válido (Guardar/Actualizar)
        if (inicio && fin) {
            horariosToSave.push({
                // El backend espera HH:mm:ss (aunque solo enviemos HH:mm)
                horaInicio: `${inicio}:00`, 
                horaFin: `${fin}:00`,
                diaSemana: day.id,
                idMedico: Number(idMedico),
            });
        } 
        
        // Caso 2: Rango Borrado (Borrar físicamente el registro)
        // Si el día estaba en la BD (current) pero las horas están vacías
        if ((!inicio || !fin) && current) {
            horariosToDelete.push(current.idHorario!);
        }
      }

      // 2. Ejecutar la lógica de Upsert (POST)
      // El SP de Upsert (sp_Admin_CrearHorario) maneja la creación/actualización
      for (const horario of horariosToSave) {
          // Llamada a POST /api/admin/horarios/{idMedico} (Punto 3.5.7)
          await api.post(`/admin/horarios/${idMedico}`, horario);
      }
      
      // 3. Ejecutar la lógica de DELETE
      for (const idHorario of horariosToDelete) {
          // Llamada a DELETE /api/admin/horarios/{idHorario} (Punto 3.5.7)
          await api.delete(`/admin/horarios/${idHorario}`);
      }

      toast.success('Horarios guardados con éxito.');
      fetchHorarios(); // Refrescar los datos de la tabla

    } catch (error) {
      let errorMessage = 'Error al guardar los horarios.';
      if (isAxiosError(error) && error.response?.data) {
        // Capturamos el error de negocio (horaInicio < horaFin) del GlobalExceptionHandler
        const data = error.response.data as { mensaje?: string };
        errorMessage = data.mensaje || Object.values(error.response.data).join(', ') || errorMessage;
      }
      toast.error('Error de Guardado', { description: errorMessage });
      
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- RENDERIZADO ---
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <CalendarDays className="h-6 w-6" />
            <span>Gestionar Horarios (Médico ID: {idMedico})</span>
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground pt-1">
          Defina el rango de hora de inicio y hora de fin para cada día de trabajo. Deje vacío para no laborar.
        </p>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />

        <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-6">
          <div className="space-y-4">
            {DÍAS_SEMANA.map((day) => (
              // Usamos Controller para manejar el estado complejo del array de inputs
              <Controller
                key={day.id}
                control={form.control}
                name={`horarios.${day.id}`} // Nombre dinámico: horarios.1, horarios.2, etc.
                render={({ field }) => (
                  <div className="grid grid-cols-5 items-center gap-4 border-b pb-4">
                    <Label className="col-span-1 font-semibold">
                      {day.nombre}
                    </Label>
                    
                    {/* Input Hora Inicio */}
                    <div className="col-span-2">
                      <Label htmlFor={`inicio-${day.id}`}>Hora Inicio</Label>
                      <Input
                        id={`inicio-${day.id}`}
                        type="time"
                        placeholder="09:00"
                        value={field.value?.horaInicio || ''}
                        onChange={(e) => field.onChange({ ...field.value, horaInicio: e.target.value })}
                        disabled={isPending}
                        className="mt-1"
                      />
                    </div>

                    {/* Input Hora Fin */}
                    <div className="col-span-2">
                      <Label htmlFor={`fin-${day.id}`}>Hora Fin</Label>
                      <Input
                        id={`fin-${day.id}`}
                        type="time"
                        placeholder="18:00"
                        value={field.value?.horaFin || ''}
                        onChange={(e) => field.onChange({ ...field.value, horaFin: e.target.value })}
                        disabled={isPending}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              />
            ))}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isPending ? 'Guardando...' : 'Guardar Horarios'}
            </Button>
          </DialogFooter>
        </form>
      </CardContent>
    </Card>
  );
}