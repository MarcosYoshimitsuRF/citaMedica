package com.citamed.patient.dtos;

import com.citamed.admin.dtos.shared.ConsultorioInfoDTO;
import lombok.Data;

/**
 * DTO para listar médicos al paciente (vista pública).
 */
@Data
public class DoctorResponseDTO {
    private Integer idMedico;
    private String nombres;
    private String apellidos;
    private String especialidad;
    // Opcional: información básica del consultorio
    private ConsultorioInfoDTO consultorio;
}