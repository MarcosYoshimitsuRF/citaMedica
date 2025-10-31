package com.citamed.domain.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Repositorio para la entidad Paciente. Define el acceso a datos.
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    /**
     * Llama al SP 'sp_RegistrarPaciente' para crear un Usuario
     * y un Paciente de forma transaccional (Punto 1.4.5).
     */
    @Modifying
    @Transactional
    @Procedure("sp_RegistrarPaciente")
    void registrarPaciente(
            @Param("p_email") String email,
            @Param("p_password_hash") String passwordHash,
            @Param("p_dni") String dni,
            @Param("p_nombres") String nombres,
            @Param("p_apellidos") String apellidos,
            @Param("p_telefono") String telefono
    );
}