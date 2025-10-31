'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Importações do Shadcn UI
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

// Importaciones de API y el Type Guard de Axios
import api from '@/lib/api';
import { isAxiosError } from 'axios'; // <--- CORRECCIÓN

// Esquema de validación del Zod (Punto 1.11.7)
const formSchema = z.object({
  dni: z
    .string()
    .length(8, 'El DNI debe tener exactamente 8 dígitos.')
    .regex(/^[0-9]+$/, 'El DNI debe contener solo números.'),
  nombres: z.string().min(2, 'Por favor, ingrese un nombre válido.'),
  apellidos: z.string().min(2, 'Por favor, ingrese un apellido válido.'),
  email: z.string().email('Por favor, ingrese un email válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

// Tipo inferido del esquema
type RegisterFormValues = z.infer<typeof formSchema>;

/**
 * Página de Registro de Pacientes (Punto 1.11.6).
 */
export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // 1. Definición del Formulario (RHF + Zod)
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
    },
  });

  // 2. Función de Envio (Punto 1.11.8)
  async function onSubmit(values: RegisterFormValues) {
    setIsPending(true);
    try {
      // 2a. Llamar al endpoint del backend
      await api.post('/auth/register', values);

      // 2b. Mostrar notificación de éxito
      toast.success('Registro exitoso!', {
        description: 'Serás redirigido al login.',
      });

      // 2c. Redireccionar a /login (Punto 1.11.8)
      router.push('/login');
      
    } catch (error) { // <--- CORRECCIÓN: 'error' es 'unknown'
      setIsPending(false);
      
      // 2d. Manejo de Error (Sin 'any')
      // Usamos el type guard 'isAxiosError' para verificar el tipo
      if (isAxiosError(error)) {
        // Ahora es seguro acceder a 'error.response'
        const errorMessage = error.response?.data?.message as string;

        if (errorMessage && errorMessage.includes('El email ya está registrado')) {
          toast.error('Error en el Registro', {
            description: 'Este email ya está en uso. Intente otro.',
          });
          form.setFocus('email');
        } else {
          toast.error('Error en el Registro', {
            description: 'No fue posible crear su cuenta. Por favor, intente nuevamente.',
          });
        }
      } else {
        // Manejo de errores genéricos
        toast.error('Error Inesperado', {
          description: 'Ha ocurrido un error. Por favor, intente nuevamente.',
        });
        console.error("Error no controlado en registro:", error);
      }
    }
  }

  // 3. Renderización de la UI (Punto 1.11.7)
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
                      placeholder="Ej: 12345678"
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            
            {/* Fila 3: Email */}
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
            
            {/* Fila 4: Contraseña */}
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