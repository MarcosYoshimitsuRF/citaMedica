package com.citamed.admin.dtos;

// Importaciones para validación
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la solicitud de CREACIÓN de un Consultorio.
 * (Usado para POST /api/admin/consultorios)
 * No incluye 'idConsultorio' ni 'estaActivo' (se manejan por defecto).
 */
@Data
public class CreateConsultorioRequest {

    @NotBlank(message = "El nombre del consultorio no puede estar vacío.")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres.")
    private String nombre;

    @Size(max = 255, message = "La ubicación no debe exceder los 255 caracteres.")
    private String ubicacion;
}