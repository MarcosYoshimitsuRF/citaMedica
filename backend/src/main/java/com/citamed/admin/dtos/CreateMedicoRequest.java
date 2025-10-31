package com.citamed.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la solicitud de CREACIÓN de un Médico.
 * (Usado para POST /api/admin/medicos)
 * Coincide con los parámetros del SP sp_Admin_CrearMedico.
 */
@Data
public class CreateMedicoRequest {

    @NotBlank(message = "El nombre no puede estar vacío.")
    @Size(max = 100)
    private String nombres;

    @NotBlank(message = "El apellido no puede estar vacío.")
    @Size(max = 100)
    private String apellidos;

    @NotBlank(message = "La especialidad no puede estar vacía.")
    @Size(max = 100)
    private String especialidad;

    // Puede ser nulo si el médico no está asignado
    private Integer idConsultorioAsignado;
}