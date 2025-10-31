package com.citamed.domain.office;

import com.citamed.domain.appointment.Cita; // Importación necesaria
import com.citamed.domain.doctor.Medico;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Entidad que mapea la tabla 'Consultorios'.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Consultorios")
public class Consultorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consultorio")
    private Integer idConsultorio;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = true, length = 255)
    private String ubicacion;

    // Campo de estado (Soft Delete)
    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo;

    /**
     * Relación Uno-a-Muchos con Medicos.
     */
    @OneToMany(mappedBy = "consultorio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Medico> medicos;

    // ------------------------------------------------------------------
    // NUEVA RELACIÓN: Citas (Inversa)
    // ------------------------------------------------------------------
    /**
     * (Punto 4.1.6) Relación Uno-a-Muchos con Citas.
     */
    @OneToMany(mappedBy = "consultorio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Ignorar al serializar
    private List<Cita> citas;
    // ------------------------------------------------------------------
}