package com.citamed.domain.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repositorio para la entidad Paciente.
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    // --- MÉTODOS DE AUTENTICACIÓN (FASE 1) ---
    @Modifying @Transactional
    @Procedure("sp_RegistrarPaciente")
    void registrarPaciente(
            @Param("p_email") String email,
            @Param("p_password_hash") String passwordHash,
            @Param("p_dni") String dni,
            @Param("p_nombres") String nombres,
            @Param("p_apellidos") String apellidos,
            @Param("p_telefono") String telefono
    );

    // ---------------------------------------------------
    // --- MÉTODOS DE ADMINISTRACIÓN (FASE 6) ---
    // ---------------------------------------------------

    @Transactional(readOnly = true) // <-- CORRECCIÓN FINAL
    @Procedure(procedureName = "sp_Admin_ListarPacientes")
    List<Paciente> spAdminListarPacientes();

    /**
     * (Punto 6.1.2) Llama a sp_Admin_ActualizarPaciente.
     */
    @Modifying @Transactional
    @Procedure(procedureName = "sp_Admin_ActualizarPaciente")
    void spAdminActualizarPaciente(
            @Param("p_id_paciente") Integer idPaciente,
            @Param("p_dni") String dni,
            @Param("p_nombres") String nombres,
            @Param("p_apellidos") String apellidos,
            @Param("p_telefono") String telefono
    );
}