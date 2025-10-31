package com.citamed.patient.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO para la solicitud de agendamiento de cita (POST /api/citas).
 * No incluye el id_paciente (sale del JWT).
 */
@Data
public class AgendarCitaRequest {

    @NotNull(message = "El ID del médico es obligatorio.")
    private Integer idMedico;

    @NotNull(message = "La fecha y hora de la cita son obligatorias.")
    @Future(message = "La cita debe ser programada en el futuro.")
    private LocalDateTime fechaHora;

    // NOTA: No se requiere id_consultorio (se busca en el SP)
    // NOTA: No se requiere id_paciente (se saca del token/contexto)
}