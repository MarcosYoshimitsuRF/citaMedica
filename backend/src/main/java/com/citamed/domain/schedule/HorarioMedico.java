package com.citamed.domain.schedule;

import com.citamed.domain.doctor.Medico;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;

/**
 * Entidad que mapea la tabla 'Horarios_Medicos'.
 * Define el rango de trabajo de un médico en un día específico.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Horarios_Medicos", uniqueConstraints = {
        // Replicamos el constraint UNIQUE de la BD a nivel de JPA
        @UniqueConstraint(columnNames = {"id_medico", "dia_semana"})
})
public class HorarioMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Integer idHorario;

    @Column(name = "dia_semana", nullable = false)
    private byte diaSemana; // TINYINT (1-7)

    @Column(name = "hora_inicio", nullable = false)
    private Time horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private Time horaFin;

    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo = true;

    /**
     * (Punto 3.1.6) Relación Muchos-a-Uno (Dueña) con Medico.
     * Varios horarios pertenecen a un médico.
     * 'id_medico' es la FK en esta tabla.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_medico", referencedColumnName = "id_medico", nullable = false)
    @JsonIgnore // CRÍTICO: Evita bucles infinitos al serializar (Horario -> Medico -> Horarios)
    private Medico medico;
}