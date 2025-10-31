package com.citamed.admin.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Time;

/**
 * DTO para la solicitud de CREACIÓN o ACTUALIZACIÓN (Upsert) de un Horario.
 * (Usado para POST /api/admin/horarios)
 * Coincide con los parámetros del SP sp_Admin_CrearHorario.
 * El id_medico vendrá de la URL, no del body.
 */
@Data
public class UpsertHorarioRequestDTO {

    @NotNull(message = "El día de la semana es obligatorio.")
    @Min(value = 1, message = "El día de la semana debe ser entre 1 (Lunes) y 7 (Domingo).")
    @Max(value = 7, message = "El día de la semana debe ser entre 1 (Lunes) y 7 (Domingo).")
    private Byte diaSemana; // byte (TINYINT)

    @NotNull(message = "La hora de inicio es obligatoria.")
    private Time horaInicio;

    @NotNull(message = "La hora de fin es obligatoria.")
    private Time horaFin;

    // NOTA: (Rol Senior) La validación de (hora_inicio < hora_fin)
    // se implementará en la capa de Servicio antes de llamar al SP,
    // para proporcionar un mensaje de error claro,
    // además de la restricción CHK de la BD.
}