package com.citamed.domain.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure; // <-- Necesario
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface MedicoRepository extends JpaRepository<Medico, Integer> {

    @Procedure(procedureName = "sp_Admin_ListarMedicos")
    List<Medico> spAdminListarMedicos();

    @Modifying @Transactional
    @Procedure(procedureName = "sp_Admin_CrearMedico")
    void spAdminCrearMedico(@Param("p_nombres") String nombres, @Param("p_apellidos") String apellidos, @Param("p_especialidad") String especialidad, @Param("p_id_consultorio_asignado") Integer idConsultorioAsignado);

    @Modifying @Transactional
    @Procedure(procedureName = "sp_Admin_ActualizarMedico")
    void spAdminActualizarMedico(@Param("p_id_medico") Integer idMedico, @Param("p_nombres") String nombres, @Param("p_apellidos") String apellidos, @Param("p_especialidad") String especialidad, @Param("p_id_consultorio_asignado") Integer idConsultorioAsignado, @Param("p_esta_activo") boolean estaActivo);

    // ERROR CORREGIDO: Se asegura que este método tenga @Procedure para compilar.
    @Modifying @Transactional
    @Procedure(procedureName = "sp_Admin_EliminarMedico") // <-- CORRECCIÓN
    void spAdminEliminarMedico(@Param("p_id_medico") Integer idMedico);


    @Transactional
    @Procedure(procedureName = "sp_ListarMedicosPublico")
    List<Medico> spListarMedicosPublico();


    @Transactional
    @Procedure(procedureName = "sp_ObtenerSlotsDisponibles")
    List<String> spObtenerSlotsDisponibles(
            @Param("p_id_medico") Integer idMedico,
            @Param("p_fecha") LocalDate fecha
    );
}