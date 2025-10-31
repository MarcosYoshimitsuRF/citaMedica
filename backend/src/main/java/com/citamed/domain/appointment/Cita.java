package com.citamed.domain.appointment;

import com.citamed.domain.doctor.Medico;
import com.citamed.domain.office.Consultorio;
import com.citamed.domain.patient.Paciente;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Citas", uniqueConstraints = {
        // Replica la restricción única de la BD (anti doble-reserva)
        @UniqueConstraint(columnNames = {"id_medico", "fecha_hora"})
})
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita")
    private Integer idCita;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora; // Usa LocalDateTime para DATETIME de MySQL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCita estado;

    /**
     * (Punto 4.1.3) Relación Muchos-a-Uno (Dueña) con Paciente.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_paciente", referencedColumnName = "id_paciente", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Paciente paciente;

    /**
     * (Punto 4.1.4) Relación Muchos-a-Uno (Dueña) con Medico.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_medico", referencedColumnName = "id_medico", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Medico medico;

    /**
     * (Punto 4.1.5) Relación Muchos-a-Uno (Dueña) con Consultorio.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_consultorio", referencedColumnName = "id_consultorio", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Consultorio consultorio;
}