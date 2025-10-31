'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Shadcn Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

// El tipo de datos que este formulario maneja
import { type ConsultorioDTO } from './columns';

// --- INICIO DE LA CORRECCIÓN 1 (Exportar) ---
/** Esquema Zod (Exportado) */
export const consultorioFormSchema = z.object({
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }).max(100),
  ubicacion: z
    .string()
    .max(255)
    .nullish()
    .transform((v) => v ?? null),
  estaActivo: z.boolean().default(true),
});

// Tipos derivados del esquema (Exportado)
type FormInput = z.input<typeof consultorioFormSchema>;
export type ConsultorioFormData = z.output<typeof consultorioFormSchema>; // <- Exportado
// --- FIN DE LA CORRECCIÓN 1 ---


/** Props del diálogo */
interface ConsultorioFormDialogProps {
  trigger: React.ReactNode;
  mode: 'create' | 'edit';
  initialData?: ConsultorioDTO;
  onSubmit: (values: ConsultorioFormData) => Promise<boolean>; // <- Ahora funciona
}

/** Componente */
export function ConsultorioFormDialog({
  trigger,
  mode,
  initialData,
  onSubmit,
}: ConsultorioFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const formTitle =
    mode === 'create' ? 'Crear Nuevo Consultorio' : 'Editar Consultorio';
  const formDescription =
    mode === 'create'
      ? 'Complete los detalles del nuevo consultorio.'
      : 'Actualice los detalles del consultorio existente.';

  const form = useForm<FormInput>({
    resolver: zodResolver(consultorioFormSchema), // <- Usa el schema exportado
    defaultValues:
      mode === 'edit' && initialData
        ? {
            nombre: initialData.nombre,
            ubicacion: initialData.ubicacion ?? null,
            estaActivo: initialData.estaActivo,
          }
        : {
            nombre: '',
            ubicacion: null,
            estaActivo: true,
          },
  });

  React.useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      form.reset({
        nombre: initialData.nombre,
        ubicacion: initialData.ubicacion ?? null,
        estaActivo: initialData.estaActivo,
      });
    }
    if (isOpen && mode === 'create') {
      form.reset({ nombre: '', ubicacion: null, estaActivo: true });
    }
  }, [isOpen, mode, initialData, form]);

  const handleValidSubmit: SubmitHandler<FormInput> = async (values) => {
    setIsPending(true);
    try {
      const parsed = consultorioFormSchema.parse(values) as ConsultorioFormData; // <- Usa el schema exportado
      const success = await onSubmit(parsed);
      
      if (success) {
        toast.success(
          `Consultorio ${mode === 'create' ? 'creado' : 'actualizado'} con éxito.`
        );
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error inesperado al guardar consultorio:', error);
      toast.error('Error inesperado', {
        description: 'No se pudo guardar el consultorio.',
      });
    } finally {
      setIsPending(false);
    }
  };

  // ... (El resto del JSX es idéntico al tuyo)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-6">
            {/* Campo Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Consultorio 101" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Ubicación */}
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Piso 1, Ala Norte"
                      {...field}
                      value={field.value ?? ''} // controlamos null/undefined -> ''
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo 'estaActivo' (Solo visible en modo Editar) */}
            {mode === 'edit' && (
              <FormField
                control={form.control}
                name="estaActivo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Estado</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}         // evita el undefined
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {mode === 'create' ? 'Crear' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}