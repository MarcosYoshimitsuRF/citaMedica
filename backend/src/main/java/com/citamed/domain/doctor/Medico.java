package com.citamed.domain.doctor;

// Importaciones añadidas
import com.citamed.domain.schedule.HorarioMedico;
import java.util.List;
// Fin de importaciones

import com.citamed.domain.office.Consultorio;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que mapea la tabla 'Medicos'.
 * (Actualizado con la relación inversa a HorarioMedico).
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

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(nullable = false)
    private String especialidad;

    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo = true;

    /**
     * (Punto 3.1.3) Relación Muchos-a-Uno (Dueña) con Consultorio.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consultorio_asignado", referencedColumnName = "id_consultorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Consultorio consultorio;

    /**
     * (Punto 3.1.7) Relación Uno-a-Muchos (Inversa) con HorarioMedico.
     * 'mappedBy = "medico"' indica que la FK está en la
     * entidad 'HorarioMedico', en el campo 'medico'.
     * 'cascade = CascadeType.ALL' y 'orphanRemoval = true' son útiles
     * para que al borrar un médico, sus horarios se borren también.
     */
    @OneToMany(
            mappedBy = "medico",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, // Propaga operaciones (ej. borrar)
            orphanRemoval = true // Elimina horarios si se quitan de esta lista
    )
    @JsonIgnoreProperties("medico") // Evita bucle, pero menos restrictivo que @JsonIgnore
    private List<HorarioMedico> horarios;


    // NOTA (Orden 4): La relación inversa @OneToMany con
    // Cita (Paso 4.1) se añadirá más adelante.
}