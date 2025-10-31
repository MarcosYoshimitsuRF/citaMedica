import axios from 'axios';

/**
 * Define la clave que usaremos para guardar el token
 * en el localStorage.
 */
export const AUTH_TOKEN_KEY = 'CITA_MED_TOKEN';

/**
 * Instancia centralizada de Axios para Cita-Med.
 * Configurada con la baseURL del backend.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

/**
 * Interceptor de Peticiones (Request Interceptor).
 *
 * Este interceptor se ejecuta ANTES de que cualquier petición
 * sea enviada al backend. Su función es leer el token
 * (que será guardado por Zustand/AuthStore en localStorage)
 * y añadirlo a la cabecera 'Authorization' automáticamente.
 */
api.interceptors.request.use(
  (config) => {
    // Solo intentamos obtener el token en el lado del cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (token) {
        // Si el token existe, lo añadimos a la cabecera
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Manejo de errores en la configuración de la petición
    return Promise.reject(error);
  }
);

export default api;