package com.citamed.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la solicitud de ACTUALIZACIÓN de un Consultorio.
 * (Usado para PUT /api/admin/consultorios/{id})
 * Coincide con los parámetros del SP sp_Admin_ActualizarConsultorio.
 */
@Data
public class UpdateConsultorioRequest {

    @NotBlank(message = "El nombre del consultorio no puede estar vacío.")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres.")
    private String nombre;

    @Size(max = 255, message = "La ubicación no debe exceder los 255 caracteres.")
    private String ubicacion;

    @NotNull(message = "El estado 'estaActivo' es obligatorio.")
    private Boolean estaActivo; // Se usa Boolean para que @NotNull pueda validarlo
}