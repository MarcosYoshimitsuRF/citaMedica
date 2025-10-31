package com.citamed.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Repositorio para la entidad Usuario.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // --- MÉTODOS DE AUTENTICACIÓN (FASE 1) ---
    @Query(value = "CALL sp_ObtenerUsuarioPorEmail(:p_email)", nativeQuery = true)
    Optional<Usuario> findByEmail(@Param("p_email") String email);

    // ---------------------------------------------------
    // --- MÉTODOS DE ADMINISTRACIÓN (FASE 6) ---
    // ---------------------------------------------------

    /**
     * (Punto 6.1.3) Llama a sp_Admin_EliminarPaciente (Soft Delete).
     * El SP busca el id_usuario asociado al id_paciente y pone esta_activo = 0.
     */
    @Modifying @Transactional
    @Procedure(procedureName = "sp_Admin_EliminarPaciente")
    void spAdminEliminarPaciente(
            @Param("p_id_paciente") Integer idPaciente
    );
}