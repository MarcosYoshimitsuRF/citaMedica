"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Users, Edit } from "lucide-react";
import { isAxiosError } from "axios";
import api from "@/lib/api";

// Componentes propios y de Shadcn
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Tipos y columnas
import { getPacienteColumns, type PacienteDTO } from "./columns";

// --- DEFINICIONES DE TIPOS Y ESQUEMA ---

const pacienteEditSchema = z.object({
  dni: z
    .string()
    .length(8, "El DNI debe tener 8 dígitos.")
    .regex(/^[0-9]+$/, "El DNI debe contener solo números."),
  nombres: z.string().min(2, { message: "El nombre es requerido." }).max(100),
  apellidos: z
    .string()
    .min(2, { message: "El apellido es requerido." })
    .max(100),
  telefono: z
    .string()
    .max(15, { message: "El teléfono es demasiado largo." })
    .nullable(),
  estaActivo: z.boolean().optional(),
});

type FormFields = z.infer<typeof pacienteEditSchema>;

type PacienteAPIData = z.infer<typeof pacienteEditSchema>;

// Función para generar valores iniciales robustos
const getInitialValues = (initialData?: PacienteDTO): FormFields => {
  const emptyValues: FormFields = {
    dni: "",
    nombres: "",
    apellidos: "",
    telefono: null,
    estaActivo: true,
  };

  if (initialData) {
    return {
      ...emptyValues,
      dni: initialData.dni,
      nombres: initialData.nombres,
      apellidos: initialData.apellidos,
      telefono: initialData.telefono || null,
      estaActivo: initialData.estaActivo,
    };
  }
  return emptyValues;
};

// Componente principal
export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Modal (Dialog) integrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<
    PacienteDTO | undefined
  >(undefined);
  const [isPending, setIsPending] = useState(false);

  // --- LÓGICA DE FETCHING ---
  const fetchPacientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PacienteDTO[]>("/admin/pacientes");
      setPacientes(response.data);
    } catch (error) {
      toast.error("Error de carga", {
        description: "No se pudieron cargar los datos de los pacientes.",
      });
      setPacientes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  // --- LÓGICA DEL FORMULARIO INTEGRADO (useForm) ---

  const form = useForm<FormFields>({
    resolver: zodResolver(pacienteEditSchema),
    defaultValues: getInitialValues(undefined),
  });

  // Resetear y cargar datos al abrir/cerrar el modal
  useEffect(() => {
    if (isModalOpen) {
      form.reset(getInitialValues(modalInitialData));
    }
  }, [isModalOpen, modalInitialData, form]);

  const handleOpenEdit = useCallback((paciente: PacienteDTO) => {
    setModalInitialData(paciente);
    setIsModalOpen(true);
  }, []);

  const handleValidSubmit: SubmitHandler<FormFields> = async (values) => {
    setIsPending(true);
    try {
      const idPaciente = modalInitialData?.idPaciente;
      if (!idPaciente)
        throw new Error("ID de paciente faltante para la edición.");

      const dataToSend: PacienteAPIData = {
        ...values,
        telefono: values.telefono || null,
        estaActivo: values.estaActivo ?? true,
      };

      await api.put(`/admin/pacientes/${idPaciente}`, dataToSend);
      toast.success("Paciente actualizado con éxito.");

      setIsModalOpen(false);
      fetchPacientes();
    } catch (error) {
      let errorMessage = "Ocurrió un error al guardar los datos.";
      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data as {
          message?: string;
          errors?: Record<string, string>;
        };
        errorMessage =
          data.message ||
          Object.values(data.errors || {}).join(", ") ||
          errorMessage;
      }
      toast.error("Error al guardar", { description: errorMessage });
    } finally {
      setIsPending(false);
    }
  };

  // --- CONFIGURACIÓN DE COLUMNAS (useMemo) ---
  const columns = useMemo(() => {
    return getPacienteColumns({
      onSuccess: fetchPacientes,
      onOpenEdit: handleOpenEdit,
    });
  }, [fetchPacientes, handleOpenEdit]);

  // --- RENDERIZADO DEL DIALOG (Modal de Edición) ---
  const PacienteFormDialog = (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          {/* CORRECCIÓN 1: Cierre correcto de DialogTitle */}
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Paciente</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Editando a: {modalInitialData?.nombres}{" "}
            {modalInitialData?.apellidos} ({modalInitialData?.email})
          </p>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleValidSubmit)}
          className="space-y-4 pt-4"
        >
          {/* Fila 1: DNI */}
          <div>
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              {...form.register("dni")}
              disabled={isPending}
              className="mt-1"
            />
            {form.formState.errors.dni && (
              <p className="text-sm font-medium text-destructive mt-1">
                {form.formState.errors.dni.message}
              </p>
            )}
          </div>

          {/* Fila 2: Nombres y Apellidos (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                {...form.register("nombres")}
                disabled={isPending}
                className="mt-1"
              />
              {form.formState.errors.nombres && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.nombres.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                {...form.register("apellidos")}
                disabled={isPending}
                className="mt-1"
              />
              {form.formState.errors.apellidos && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.apellidos.message}
                </p>
              )}
            </div>
          </div>

          {/* Fila 3: Teléfono */}
          <div>
            <Label htmlFor="telefono">Teléfono (Opcional)</Label>
            <Input
              id="telefono"
              {...form.register("telefono")}
              disabled={isPending}
              className="mt-1"
            />
            {form.formState.errors.telefono && (
              <p className="text-sm font-medium text-destructive mt-1">
                {form.formState.errors.telefono.message}
              </p>
            )}
          </div>

          {/* Fila 4: Estado de la cuenta (Switch) */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label htmlFor="estaActivo">Cuenta Activa</Label>
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

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  // --- RENDERIZADO PRINCIPAL (Page) ---
  return (
    <>
      {PacienteFormDialog}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Users className="h-6 w-6" />
            <span>Gestión de Pacientes</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Administra los datos demográficos y el estado de la cuenta de los
            pacientes.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end pb-4">
            {/* El registro es público. */}
          </div>
          <Separator className="mb-4" />
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={pacientes}
              isLoading={isLoading}
              filterColumnId="email" // <-- CORRECCIÓN: Usamos la columna 'email' para el filtro
              filterPlaceholder="Buscar por email..."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
