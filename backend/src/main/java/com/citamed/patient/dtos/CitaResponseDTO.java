package com.citamed.patient.dtos;

import com.citamed.domain.appointment.EstadoCita;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO para la respuesta de una cita (Usado en Mis Citas y Citas Admin).
 * Contiene datos enriquecidos de Medico y Paciente.
 */
@Data
@Builder
public class CitaResponseDTO {
    private Integer idCita;
    private LocalDateTime fechaHora;
    private EstadoCita estado;

    // Información del Médico
    private Integer idMedico;
    private String medicoNombres;
    private String medicoApellidos;
    private String especialidad;

    // Información del Paciente (solo para Admin)
    private Integer idPaciente;
    private String pacienteNombres;
    private String pacienteApellidos;
    private String pacienteDni;
    private String pacienteEmail;
}