import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// Importa o componente Toaster do Sonner
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cita-Med - Agendamento Online',
  description: 'Sistema de agendamento de consultas médicas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* O children representa a página atual */}
        {children}
        
        {/* O Toaster é o container onde as notificações 
          (Sonner) aparecerão. Deve ser colocado no layout raiz.
        */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}