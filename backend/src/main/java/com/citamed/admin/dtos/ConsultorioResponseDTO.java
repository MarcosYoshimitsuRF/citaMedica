package com.citamed.admin.dtos;

import lombok.Data;

/**
 * DTO para las respuestas del API de Consultorios.
 * (Usado para GET /api/admin/consultorios)
 */
@Data
public class ConsultorioResponseDTO {
    private Integer idConsultorio;
    private String nombre;
    private String ubicacion;
    private boolean estaActivo;
}