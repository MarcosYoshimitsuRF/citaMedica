package com.citamed.admin.dtos;

import lombok.Data;
import java.sql.Time;

/**
 * DTO para las respuestas del API de Horarios.
 * (Usado para GET /api/admin/horarios)
 */
@Data
public class HorarioMedicoResponseDTO {
    private Integer idHorario;
    private Integer idMedico;
    private byte diaSemana; // 1=Lunes, 7=Domingo
    private Time horaInicio;
    private Time horaFin;
    private boolean estaActivo;
}