package com.citamed.domain.office;

// Importaciones añadidas
import com.citamed.domain.doctor.Medico;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
// Fin de importaciones

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que mapea la tabla 'Consultorios'.
 * (Actualizado con la relación inversa a Medico).
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

    @Column(nullable = false, unique = true)
    private String nombre;

    private String ubicacion;

    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo = true;

    /**
     * (Punto 3.1.4) Relación Uno-a-Muchos (Inversa) con Medico.
     * 'mappedBy = "consultorio"' indica que la FK está en la
     * entidad 'Medico', en el campo 'consultorio'.
     * 'FetchType.LAZY' es crucial para el rendimiento.
     */
    @OneToMany(mappedBy = "consultorio", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore // CRÍTICO: Evita bucles infinitos de serialización JSON
    private List<Medico> medicos;
}