package com.citamed.admin.dtos.shared;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO anidado reutilizable.
 * Proporciona la información mínima de un consultorio
 * para ser usada dentro de otros DTOs (ej. MedicoResponseDTO).
 */
@Data
@NoArgsConstructor
public class ConsultorioInfoDTO {
    private Integer idConsultorio;
    private String nombre;
}