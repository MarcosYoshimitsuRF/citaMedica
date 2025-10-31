package com.citamed.admin.dtos;

import com.citamed.admin.dtos.shared.ConsultorioInfoDTO;
import lombok.Data;

/**
 * DTO para las respuestas del API de Médicos.
 * (Usado para GET /api/admin/medicos)
 */
@Data
public class MedicoResponseDTO {
    private Integer idMedico;
    private String nombres;
    private String apellidos;
    private String especialidad;
    private boolean estaActivo;

    // Objeto anidado para la información del consultorio
    private ConsultorioInfoDTO consultorio;
}