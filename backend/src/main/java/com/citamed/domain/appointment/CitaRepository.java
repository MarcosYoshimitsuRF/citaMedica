package com.citamed.domain.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Repositorio para la entidad Cita.
 * Mapea los SPs de gestión de citas.
 */
@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {

    /**
     * (Punto 4.2.2) Llama a sp_AgendarCita.
     * Inserta una nueva cita con estado CONFIRMADA.
     * El SP internamente busca el id_consultorio.
     */
    @Modifying
    @Transactional
    @Procedure(procedureName = "sp_AgendarCita")
    void spAgendarCita(
            @Param("p_id_paciente") Integer idPaciente,
            @Param("p_id_medico") Integer idMedico,
            @Param("p_fecha_hora") LocalDateTime fechaHora
    );

    // NOTA: Los SPs de listado/cancelación de citas para el paciente y admin
    // (Puntos 5.1.1 a 5.1.4) se añadirán a este repositorio en la FASE 5.
}