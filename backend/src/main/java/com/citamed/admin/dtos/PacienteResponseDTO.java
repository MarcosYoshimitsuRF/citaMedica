package com.citamed.admin.dtos;

import lombok.Data;

/**
 * DTO para la respuesta del API de Pacientes (Admin).
 * Contiene datos combinados de Pacientes y Usuarios.
 */
@Data
public class PacienteResponseDTO {
    private Integer idPaciente;
    private String dni;
    private String nombres;
    private String apellidos;
    private String telefono;

    // Datos de Usuario
    private String email;
    private boolean estaActivo;
}