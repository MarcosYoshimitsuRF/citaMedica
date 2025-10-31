package com.citamed.domain.office;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repositorio para la entidad Consultorio.
 * Mapea los SPs del CRUD de Administración.
 */
@Repository
public interface ConsultorioRepository extends JpaRepository<Consultorio, Integer> {

    /**
     * Llama a sp_Admin_ListarConsultorios.
     * El SP (SELECT *) mapea directamente a una lista de entidades Consultorio.
     */
    @Procedure(procedureName = "sp_Admin_ListarConsultorios")
    List<Consultorio> spAdminListarConsultorios();

    /**
     * Llama a sp_Admin_CrearConsultorio.
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_CrearConsultorio")
    void spAdminCrearConsultorio(
            @Param("p_nombre") String nombre,
            @Param("p_ubicacion") String ubicacion
    );

    /**
     * Llama a sp_Admin_ActualizarConsultorio.
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_ActualizarConsultorio")
    void spAdminActualizarConsultorio(
            @Param("p_id_consultorio") Integer idConsultorio,
            @Param("p_nombre") String nombre,
            @Param("p_ubicacion") String ubicacion,
            @Param("p_esta_activo") boolean estaActivo // TINYINT(1) mapea a boolean
    );

    /**
     * Llama a sp_Admin_EliminarConsultorio (Soft Delete).
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_Admin_EliminarConsultorio")
    void spAdminEliminarConsultorio(
            @Param("p_id_consultorio") Integer idConsultorio
    );
}