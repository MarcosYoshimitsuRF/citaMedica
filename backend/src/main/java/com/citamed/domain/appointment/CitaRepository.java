package com.citamed.domain.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad Cita.
 * (Actualizado para incluir los SPs de la FASE 5: Gestión de Citas).
 */
@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {

    // --- MÉTODOS DE AGENDAMIENTO (FASE 4) ---
    @Modifying @Transactional
    @Procedure(procedureName = "sp_AgendarCita")
    void spAgendarCita(
            @Param("p_id_paciente") Integer idPaciente,
            @Param("p_id_medico") Integer idMedico,
            @Param("p_fecha_hora") LocalDateTime fechaHora
    );

    // ---------------------------------------------------
    // --- MÉTODOS DE GESTIÓN (FASE 5) ---
    // ---------------------------------------------------

    /**
     * (Punto 5.1.1) Llama a sp_ObtenerCitasPorPaciente.
     * Devuelve el historial de citas enriquecido del paciente logueado.
     */
    @Transactional(readOnly = true)
    @Procedure(procedureName = "sp_ObtenerCitasPorPaciente")
    List<Cita> spObtenerCitasPorPaciente(
            @Param("p_id_paciente") Integer idPaciente
    );

    /**
     * (Punto 5.1.2) Llama a sp_CancelarCitaPaciente.
     * Cancela la cita solo si el id_paciente coincide (Segregación).
     */
    @Modifying @Transactional
    @Procedure(procedureName = "sp_CancelarCitaPaciente")
    void spCancelarCitaPaciente(
            @Param("p_id_cita") Integer idCita,
            @Param("p_id_paciente") Integer idPaciente
    );

    /**
     * (Punto 5.1.3) Llama a sp_Admin_ListarTodasCitas.
     * Devuelve todas las citas (Admin).
     * Nota: El SP de MySQL se modificó en FASE 0 para aceptar filtros opcionales.
     */
    @Transactional(readOnly = true)
    @Procedure(procedureName = "sp_Admin_ListarTodasCitas")
    List<Cita> spAdminListarTodasCitas(
            @Param("p_fecha_inicio") String fechaInicio,
            @Param("p_fecha_fin") String fechaFin,
            @Param("p_id_medico") Integer idMedico
    );

    /**
     * (Punto 5.1.4) Llama a sp_Admin_CancelarCita.
     * Cancela la cita a CANCELADA_ADMIN (sin filtro por paciente).
     */
    @Modifying @Transactional
    @Procedure(procedureName = "sp_Admin_CancelarCita")
    void spAdminCancelarCita(
            @Param("p_id_cita") Integer idCita
    );
}