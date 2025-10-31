package com.citamed.domain.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repositorio para la entidad Medico.
 * Mapea los SPs del CRUD de Administración.
 */
@Repository
public interface MedicoRepository extends JpaRepository<Medico, Integer> {

    /**
     * Llama a sp_Admin_ListarMedicos.
     * El SP (SELECT *) mapea directamente a una lista de entidades Medico.
     */
    @Procedure(procedureName = "sp_Admin_ListarMedicos")
    List<Medico> spAdminListarMedicos();

    /**
     * Llama a sp_Admin_CrearMedico.
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_CrearMedico")
    void spAdminCrearMedico(
            @Param("p_nombres") String nombres,
            @Param("p_apellidos") String apellidos,
            @Param("p_especialidad") String especialidad,
            @Param("p_id_consultorio_asignado") Integer idConsultorioAsignado
    );

    /**
     * Llama a sp_Admin_ActualizarMedico.
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_ActualizarMedico")
    void spAdminActualizarMedico(
            @Param("p_id_medico") Integer idMedico,
            @Param("p_nombres") String nombres,
            @Param("p_apellidos") String apellidos,
            @Param("p_especialidad") String especialidad,
            @Param("p_id_consultorio_asignado") Integer idConsultorioAsignado,
            @Param("p_esta_activo") boolean estaActivo
    );

    /**
     * Llama a sp_Admin_EliminarMedico (Soft Delete).
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_EliminarMedico")
    void spAdminEliminarMedico(
            @Param("p_id_medico") Integer idMedico
    );

    // NOTA (Orden 4): Los SPs sp_ListarMedicosPublico y
    // sp_ObtenerSlotsDisponibles (FASE 4) se añadirán a este
    // repositorio más adelante, como lo indica el roadmap [cite: 561-562].
}