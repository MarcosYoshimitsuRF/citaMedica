'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import api from '@/lib/api';

// Shadcn Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Esquema de validación Zod (CORRECCIÓN: Añadir teléfono)
const formSchema = z.object({
  dni: z
    .string()
    .length(8, 'El DNI debe tener exactamente 8 dígitos.')
    .regex(/^[0-9]+$/, 'El DNI debe contener solo números.'),
  nombres: z.string().min(2, 'Por favor, ingrese un nombre válido.'),
  apellidos: z.string().min(2, 'Por favor, ingrese un apellido válido.'),
  
  // CORRECCIÓN: Campo teléfono añadido al esquema (opcional)
  telefono: z.string().max(15, 'El teléfono es demasiado largo.').optional(),
  
  email: z.string().email('Por favor, ingrese un email válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

// Tipo inferido del esquema
type RegisterFormValues = z.infer<typeof formSchema>;

/**
 * Página de Registro de Pacientes.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      // Inicializar el nuevo campo
      telefono: '', 
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsPending(true);
    try {
      // Usamos los valores tal como vienen, incluyendo teléfono
      await api.post('/auth/register', values); 

      toast.success('Registro exitoso!', {
        description: 'Serás redirigido al login.',
      });

      router.push('/login');
      
    } catch (error) {
      setIsPending(false);
      
      let errorMessage = 'Email o DNI ya están registrados.';
      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { message?: string };
        if (data.message?.includes('El email ya está registrado')) {
            errorMessage = 'Este email ya está en uso. Intente otro.';
            form.setFocus('email');
        } else if (data.message?.includes('Duplicate entry')) {
            errorMessage = 'El DNI o el Email ya existen.';
        }
      }
      
      toast.error('Error en el Registro', { description: errorMessage });
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Crear tu Cuenta</CardTitle>
        <CardDescription>
          Completa tus datos para agendar tus citas.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Fila 1: DNI */}
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI (Documento de Identidad)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 12345678"
                      {...field}
                      disabled={isPending}
                      maxLength={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Fila 2: Nombres y Apellidos (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder="Tus nombres" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder="Tus apellidos" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fila 3: Teléfono (NUEVA FILA) */}
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: 999123456"
                      {...field}
                      disabled={isPending}
                      value={field.value || ''} // Manejar valor nulo/opcional
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Fila 4 (Original 3): Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tuemail@ejemplo.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Fila 5 (Original 4): Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="•••••••• (mín. 6 caracteres)"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Botón de Envio */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-center text-sm">
        {/* Link para Login */}
        <p className="text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}