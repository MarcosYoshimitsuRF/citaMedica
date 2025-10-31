package com.citamed.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la solicitud de ACTUALIZACIÓN de Pacientes (Admin).
 */
@Data
public class UpdatePacienteRequest {

    @NotBlank(message = "El DNI es obligatorio.")
    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 dígitos numéricos.")
    private String dni;

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100)
    private String nombres;

    @NotBlank(message = "El apellido es obligatorio.")
    @Size(max = 100)
    private String apellidos;

    @Size(max = 15, message = "El teléfono no debe exceder los 15 caracteres.")
    private String telefono;
}