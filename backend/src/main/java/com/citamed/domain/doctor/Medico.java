package com.citamed.domain.doctor;

import com.citamed.domain.appointment.Cita; // Importación necesaria
import com.citamed.domain.office.Consultorio;
import com.citamed.domain.schedule.HorarioMedico;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Entidad que mapea la tabla 'Medicos'.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Medicos")
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medico")
    private Integer idMedico;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 100)
    private String especialidad;

    // Campo de estado (Soft Delete)
    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo;

    /**
     * Relación Muchos-a-Uno con Consultorio.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consultorio", referencedColumnName = "id_consultorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Consultorio consultorio;

    /**
     * Relación Uno-a-Muchos con Horarios_Medicos.
     */
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Ignorar al serializar
    private List<HorarioMedico> horarios;

    // ------------------------------------------------------------------
    // NUEVA RELACIÓN: Citas (Inversa)
    // ------------------------------------------------------------------
    /**
     * (Punto 4.1.6) Relación Uno-a-Muchos con Citas.
     */
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Ignorar al serializar
    private List<Cita> citas;
    // ------------------------------------------------------------------
}