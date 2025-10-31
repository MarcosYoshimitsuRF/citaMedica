// Tipos para el estado de la cita (Enum de Java)
export type EstadoCita = 'CONFIRMADA' | 'CANCELADA_PACIENTE' | 'CANCELADA_ADMIN';

/**
 * Define el tipo de datos para la fila de la tabla de Citas del Paciente.
 * (Coincide con CitaResponseDTO del backend).
 */
export interface CitaPacienteDTO {
  idCita: number;
  fechaHora: string; // LocalDateTime se recibe como string ISO
  estado: EstadoCita;
  
  // Información del Médico (enriquecida)
  idMedico: number;
  medicoNombres: string;
  medicoApellidos: string;
  especialidad: string;
}

/**
 * Define el tipo de datos para la tabla del Administrador (incluye Paciente).
 */
export interface CitaAdminDTO extends CitaPacienteDTO {
  // Información del Paciente (adicional para el admin)
  idPaciente: number;
  pacienteNombres: string;
  pacienteApellidos: string;
  pacienteDni: string;
  pacienteEmail: string;
}