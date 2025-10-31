package com.citamed.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad Usuario. Define el acceso a datos.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Busca un usuario por email llamando al SP.
     * Esta es la implementación de los Puntos 1.4.2 y 1.4.3.
     *
     * @param email El email del usuario a buscar.
     * @return Un Optional que contiene al Usuario si se encuentra y está activo.
     */
    @Query(value = "CALL sp_ObtenerUsuarioPorEmail(:p_email)", nativeQuery = true)
    Optional<Usuario> findByEmail(@Param("p_email") String email);
}