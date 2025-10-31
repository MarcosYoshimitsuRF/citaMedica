'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { isAxiosError } from 'axios';
import api from '@/lib/api';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Tipos de datos (Coinciden con DoctorResponseDTO)
interface Doctor {
    idMedico: number;
    nombres: string;
    apellidos: string;
    especialidad: string;
    consultorio: { idConsultorio: number; nombre: string } | null;
}

// Interfaz para el estado de la hora seleccionada
interface SelectedSlot {
  medicoId: number;
  fechaHora: string; // Formato YYYY-MM-DDT HH:mm:00
  horaStr: string; // Formato HH:mm
}

/**
 * Página principal para Agendar Cita (Slot Generator) (Punto 4.4.1).
 */
export default function AgendarCitaPage() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [selectedMedicoId, setSelectedMedicoId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Estados de control de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [isAppointmentPending, setIsAppointmentPending] = useState(false);

  // 1. Cargar la lista de médicos al montar el componente (Punto 4.4.3)
  useEffect(() => {
    const fetchDoctores = async () => {
      setIsLoading(true);
      try {
        // Llama a GET /api/medicos
        const response = await api.get<Doctor[]>('/medicos');
        setDoctores(response.data);
      } catch (error) {
        toast.error('Error', { description: 'No se pudieron cargar los médicos disponibles.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctores();
  }, []);

  // 2. Lógica del Slot Generator (Punto 4.4.4)
  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedMedicoId || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    setIsSlotLoading(true);
    // Formato de fecha para el Query Param (YYYY-MM-DD)
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      // Llamada clave al Slot Generator: GET /api/medicos/{id}/disponibilidad?fecha=...
      const response = await api.get<string[]>(
        `/medicos/${selectedMedicoId}/disponibilidad`,
        { params: { fecha: formattedDate } }
      );
      
      setAvailableSlots(response.data.map(timeStr => timeStr.substring(0, 5))); // HH:mm
    } catch (error) {
      toast.error('Error', { description: 'No se pudo obtener la disponibilidad para esa fecha.' });
      setAvailableSlots([]);
    } finally {
      setIsSlotLoading(false);
    }
  }, [selectedMedicoId, selectedDate]);

  // Ejecutar el fetch cuando cambie el médico o la fecha
  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);
  
  // 3. Manejar la selección de un slot (Punto 4.4.6)
  const handleSlotSelection = (horaStr: string) => {
    if (!selectedMedicoId || !selectedDate) return;

    // Combinar la fecha seleccionada y la hora del slot (Ej: 2025-11-05T10:00:00)
    const fechaHora = format(selectedDate, 'yyyy-MM-dd') + 'T' + horaStr + ':00';

    setSelectedSlot({
      medicoId: selectedMedicoId,
      fechaHora: fechaHora,
      horaStr: horaStr,
    });
    setIsModalOpen(true); // Abrir Dialog de confirmación
  };
  
  // 4. Agendar Cita (Punto 4.4.7)
  const handleConfirmAppointment = async () => {
    if (!selectedSlot) return;
    
    setIsAppointmentPending(true);
    try {
      // Llama a POST /api/citas con el id_medico y fecha_hora
      await api.post('/citas', {
        idMedico: selectedSlot.medicoId,
        fechaHora: selectedSlot.fechaHora,
      });

      toast.success('Cita Agendada con Éxito', { // Mostrar Sonner de éxito (Punto 4.4.7)
        description: `Su cita con el Dr(a). ha sido confirmada para las ${selectedSlot.horaStr}.`,
      });
      
      // Limpiar estados y refrescar slots disponibles (Punto 4.4.7)
      setIsModalOpen(false);
      setSelectedSlot(null);
      fetchAvailableSlots(); 

    } catch (error) {
      let errorMessage = 'No se pudo agendar la cita. Es posible que el slot haya sido reservado por otro paciente.';
      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { message?: string };
        errorMessage = data.message || errorMessage;
      }
      toast.error('Fallo al Agendar', { description: errorMessage });
    } finally {
      setIsAppointmentPending(false);
    }
  };


  // --- RENDERIZADO ---

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const medicoSeleccionado = doctores.find(d => d.idMedico === selectedMedicoId);
  const isSearchDisabled = !selectedMedicoId || !selectedDate || isSlotLoading;


  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Agendar Cita Médica</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Selección de Médico y Fecha</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-3 gap-6">
          
          {/* Columna 1: Selección de Médico (Punto 4.4.2) */}
          <div className="space-y-4 lg:col-span-1">
            <Label>Paso 1: Seleccionar Médico</Label>
            <Select
              onValueChange={(value) => setSelectedMedicoId(Number(value))}
              disabled={doctores.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Elija un médico" />
              </SelectTrigger>
              <SelectContent>
                {doctores.map((doctor) => (
                  <SelectItem key={doctor.idMedico} value={String(doctor.idMedico)}>
                    Dr(a). {doctor.apellidos} ({doctor.especialidad})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {medicoSeleccionado?.consultorio && (
              <p className="text-sm text-muted-foreground">
                Consultorio: {medicoSeleccionado.consultorio.nombre}
              </p>
            )}
          </div>
          
          {/* Columna 2: Calendario (Punto 4.4.2) */}
          <div className="flex justify-center lg:col-span-2">
            <div className="space-y-2">
              <Label>Paso 2: Seleccionar Fecha</Label>
              <ShadcnCalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(Date.now() - 86400000)} // Deshabilitar fechas pasadas
                initialFocus
                className="rounded-md border p-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* SECCIÓN DE SLOTS DISPONIBLES (Punto 4.4.5) */}
      <Card className="mt-6 shadow-lg" id="slots-section">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Slots Disponibles para {selectedDate ? format(selectedDate, 'PPP') : 'la fecha seleccionada'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          
          {isSlotLoading && (
            <div className="flex h-16 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          
          {selectedMedicoId && selectedDate && !isSlotLoading && availableSlots.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {availableSlots.map((slot) => (
                // Renderizar como botones de contorno
                <Button 
                  key={slot} 
                  variant="outline" 
                  onClick={() => handleSlotSelection(slot)}
                  className="font-semibold"
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
          
          {!selectedMedicoId && <p className="text-muted-foreground">Seleccione un médico para ver la disponibilidad.</p>}
          {selectedMedicoId && selectedDate && !isSlotLoading && availableSlots.length === 0 && (
            <p className="text-destructive">No hay slots disponibles para el médico en la fecha seleccionada.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogo de Confirmación de Cita */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Agendamiento</DialogTitle>
            <DialogDescription>
              ¿Desea confirmar la cita para el día{' '}
              <span className="font-semibold">
                {selectedDate ? format(selectedDate, 'PPP') : ''}
              </span>{' '}
              a las{' '}
              <span className="font-semibold">{selectedSlot?.horaStr}</span>
              {' '}con el Dr(a). {medicoSeleccionado?.apellidos}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isAppointmentPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmAppointment} disabled={isAppointmentPending}>
              {isAppointmentPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirmar Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}