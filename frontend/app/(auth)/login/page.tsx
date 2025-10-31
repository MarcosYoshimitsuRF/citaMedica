'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Importaciones de Shadcn UI
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

// Importaciones de nuestro Store y API
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/lib/api';

// Esquema de validación de Zod
const formSchema = z.object({
  email: z.string().email('Por favor, ingrese un email válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

// Tipo inferido del esquema
type LoginFormValues = z.infer<typeof formSchema>;

/**
 * Página de Login Unificada (Corregida)
 */
export default function LoginPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // --- CORRECCIÓN: INICIO ---
  // (Punto 1.11.4)
  // Seleccionamos las acciones de forma individual.
  // Las funciones (acciones) son estáticas y esta sintaxis
  // previene el bucle de renderizado infinito.
  const loginAction = useAuthStore((state) => state.login);
  const hydrate = useAuthStore((state) => state.hydrate);
  // --- CORRECCIÓN: FIN ---

  // (Mejora Senior) Hidratar el store en la montura del cliente
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 1. Definición del Formulario (RHF + Zod)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Función de Envio (Punto 1.11.4)
  async function onSubmit(values: LoginFormValues) {
    setIsPending(true);
    try {
      // 2a. Llamar al endpoint del backend
      const response = await api.post('/auth/login', values);
      const token: string = response.data.token;

      // 2b. Usar la acción del store para salvar el token y decodificar el rol
      loginAction(token);

      // 2c. Obtener el rol recién decodificado del store
      const role = useAuthStore.getState().rol;

      toast.success('Inicio de sesión exitoso!', {
        description: `Redirigiendo a tu panel...`,
      });

      // 2d. Redirección basada en Rol
      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'PACIENTE') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      // 2e. Manejo de Error
      setIsPending(false);
      toast.error('Error de Inicio de Sesión', {
        description:
          'Email o contraseña incorrectos. Por favor, intente nuevamente.',
      });
    }
  }

  // 3. Renderización de la UI (Punto 1.11.3)
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Cita-Med</CardTitle>
        <CardDescription>
          Bienvenido de vuelta. Inicia sesión para continuar.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Email */}
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
            {/* Campo Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
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
              {isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-center text-sm">
        {/* Link para Registro (Punto 1.11.5) */}
        <p className="text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}