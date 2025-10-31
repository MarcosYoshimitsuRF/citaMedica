package com.citamed.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la solicitud de ACTUALIZACIÓN de un Médico.
 * (Usado para PUT /api/admin/medicos/{id})
 * Coincide con los parámetros del SP sp_Admin_ActualizarMedico.
 */
@Data
public class UpdateMedicoRequest {

    @NotBlank(message = "El nombre no puede estar vacío.")
    @Size(max = 100)
    private String nombres;

    @NotBlank(message = "El apellido no puede estar vacío.")
    @Size(max = 100)
    private String apellidos;

    @NotBlank(message = "La especialidad no puede estar vacía.")
    @Size(max = 100)
    private String especialidad;

    // Puede ser nulo
    private Integer idConsultorioAsignado;

    @NotNull(message = "El estado 'estaActivo' es obligatorio.")
    private Boolean estaActivo;
}