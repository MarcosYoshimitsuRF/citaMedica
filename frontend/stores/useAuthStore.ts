import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '@/lib/api'; // Usamos '@/' (alias de TS)

/**
 * Define la estructura de los claims (payload) que
 * esperamos dentro de nuestro JWT (generado por el backend).
 */
interface JwtPayload {
  sub: string; // Subject (email)
  id_usuario: number;
  rol: 'ADMIN' | 'PACIENTE';
  iat: number;
  exp: number;
}

/**
 * Define el estado (los datos) que gestionará el store.
 */
interface AuthState {
  token: string | null;
  rol: 'ADMIN' | 'PACIENTE' | null;
  isAuthenticated: boolean;
}

/**
 * Define las acciones (funciones) que modifican el estado.
 */
interface AuthActions {
  /**
   * Acción de Login (Punto 1.10.3).
   * Guarda el token, decodifica el rol y persiste en localStorage.
   */
  login: (token: string) => void;

  /**
   * Acción de Logout (Punto 1.10.4).
   * Limpia el estado y el localStorage.
   */
  logout: () => void;

  /**
   * (Mejora Senior) Acción de Hidratación.
   * Lee el token del localStorage al cargar la app
   * para mantener la sesión persistente.
   */
  hydrate: () => void;
}

// Define el estado inicial
const initialState: AuthState = {
  token: null,
  rol: null,
  isAuthenticated: false,
};

/**
 * Creación del store 'useAuthStore' (Zustand).
 */
export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  login: (token: string) => {
    try {
      // 1. Decodificar el token para extraer el rol (Punto 1.10.3)
      const decoded = jwtDecode<JwtPayload>(token);
      const rol = decoded.rol;

      // 2. Guardar el token en localStorage (Punto 1.10.3)
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // 3. Actualizar el estado global
      set({ token, rol, isAuthenticated: true });
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      // Si el token es inválido, forzamos un logout
      set(initialState);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },

  logout: () => {
    // 1. Limpiar el localStorage (Punto 1.10.4)
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // 2. Resetear el estado global
    set(initialState);
  },

  hydrate: () => {
    // (Solo se ejecuta en el cliente)
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        const rol = decoded.rol;

        // Comprobar si el token ha expirado
        if (decoded.exp * 1000 > Date.now()) {
          // Token válido: re-hidratar el estado
          set({ token, rol, isAuthenticated: true });
        } else {
          // Token expirado: limpiar
          localStorage.removeItem(AUTH_TOKEN_KEY);
          set(initialState);
        }
      }
    } catch (error) {
      // Token inválido o corrupto en localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      set(initialState);
    }
  },
}));