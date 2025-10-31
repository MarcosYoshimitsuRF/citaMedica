package com.citamed.domain.appointment;

/**
 * Enumeración pública para los posibles estados de una cita.
 * Coincide con el ENUM de la BD.
 */
public enum EstadoCita {
    CONFIRMADA,
    CANCELADA_PACIENTE,
    CANCELADA_ADMIN
}