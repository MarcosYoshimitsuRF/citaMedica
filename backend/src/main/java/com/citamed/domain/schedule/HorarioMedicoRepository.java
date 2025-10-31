package com.citamed.domain.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.util.List;

/**
 * Repositorio para la entidad HorarioMedico.
 * Mapea los SPs del CRUD de Administración.
 */
@Repository
public interface HorarioMedicoRepository extends JpaRepository<HorarioMedico, Integer> {

    /**
     * Llama a sp_Admin_ObtenerHorariosPorMedico.
     * Devuelve todos los horarios (rangos) de un médico específico.
     */
    @Procedure(procedureName = "sp_Admin_ObtenerHorariosPorMedico")
    List<HorarioMedico> spAdminObtenerHorariosPorMedico(
            @Param("p_id_medico") Integer idMedico
    );

    /**
     * Llama a sp_Admin_CrearHorario.
     * (Implementado en FASE 0 como "Upsert" para facilidad de UI).
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_CrearHorario")
    void spAdminCrearHorario(
            @Param("p_id_medico") Integer idMedico,
            @Param("p_dia_semana") byte diaSemana, // Mapea a TINYINT
            @Param("p_hora_inicio") Time horaInicio, // Mapea a TIME
            @Param("p_hora_fin") Time horaFin      // Mapea a TIME
    );

    /**
     * Llama a sp_Admin_EliminarHorario (Hard Delete).
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_EliminarHorario")
    void spAdminEliminarHorario(
            @Param("p_id_horario") Integer idHorario
    );
}