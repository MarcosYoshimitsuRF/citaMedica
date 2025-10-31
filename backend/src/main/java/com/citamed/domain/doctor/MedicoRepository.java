package com.citamed.domain.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para la entidad Medico.
 * (Actualizado para incluir los SPs de la FASE 4: Agendamiento).
 */
@Repository
public interface MedicoRepository extends JpaRepository<Medico, Integer> {

    // --- Métodos de Administración (CRUD - FASE 3) ---
    // (Omitidos por brevedad, se asume que existen)
    List<Medico> spAdminListarMedicos();
    void spAdminCrearMedico(@Param("p_nombres") String nombres, @Param("p_apellidos") String apellidos, @Param("p_especialidad") String especialidad, @Param("p_id_consultorio_asignado") Integer idConsultorioAsignado);
    void spAdminActualizarMedico(@Param("p_id_medico") Integer idMedico, @Param("p_nombres") String nombres, @Param("p_apellidos") String apellidos, @Param("p_especialidad") String especialidad, @Param("p_id_consultorio_asignado") Integer idConsultorioAsignado, @Param("p_esta_activo") boolean estaActivo);
    void spAdminEliminarMedico(@Param("p_id_medico") Integer idMedico);

    // ---------------------------------------------------
    // --- Métodos de Agendamiento (FASE 4) ---
    // ---------------------------------------------------

    /**
     * (Punto 4.2.3) Llama a sp_ListarMedicosPublico.
     * Devuelve una lista simple de Médicos activos (SELECT parcial).
     * @return Lista de entidades Medico (solo con campos públicos).
     */
    @Transactional(readOnly = true)
    @Procedure(procedureName = "sp_ListarMedicosPublico")
    List<Medico> spListarMedicosPublico();

    /**
     * (Punto 4.2.4) Llama a sp_ObtenerSlotsDisponibles (Slot Generator).
     * El SP devuelve una tabla temporal de tiempos (TIME).
     * Mapeamos el resultado a una lista de cadenas (String).
     *
     * @param idMedico ID del médico.
     * @param fecha Fecha solicitada (solo fecha, no hora).
     * @return Lista de Strings en formato HH:mm:ss (Ej: "09:00:00").
     */
    @Transactional
    @Procedure(procedureName = "sp_ObtenerSlotsDisponibles")
    List<String> spObtenerSlotsDisponibles(
            @Param("p_id_medico") Integer idMedico,
            @Param("p_fecha") LocalDate fecha
    );
}