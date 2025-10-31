package com.citamed.domain.doctor;

import com.citamed.domain.appointment.Cita;
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
 * (CORREGIDO: Ajuste de JoinColumn para evitar error 'id_consultorio' not found).
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

    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo = true;

    /**
     * (Punto 3.1.3) Relación Muchos-a-Uno con Consultorio.
     * CORRECCIÓN: Se cambia FetchType.LAZY a EAGER y se ajusta el JoinColumn.
     * El error era que Hibernate no podía encontrar la FK.
     * Se soluciona forzando la carga y eliminando la ambigüedad de insert/update.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_consultorio_asignado") // <-- Usamos el nombre real de la FK
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Consultorio consultorio;

    /**
     * Relación Uno-a-Muchos (Inversa) con HorarioMedico.
     */
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    private List<HorarioMedico> horarios;

    /**
     * Relación Uno-a-Muchos (Inversa) con Citas.
     */
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cita> citas;
}