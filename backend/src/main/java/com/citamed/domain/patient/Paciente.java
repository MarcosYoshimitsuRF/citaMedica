package com.citamed.domain.patient;

import com.citamed.domain.appointment.Cita;
import com.citamed.domain.user.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Entidad que mapea la tabla 'Pacientes'.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer idPaciente;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 20)
    private String dni;

    // Campo de estado (Soft Delete)
    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo;

    /**
     * Relación Uno-a-Uno con Usuarios (clave foránea).
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    // ------------------------------------------------------------------
    // NUEVA RELACIÓN: Citas (Inversa)
    // ------------------------------------------------------------------
    /**
     * (Punto 4.1.6) Relación Uno-a-Muchos con Citas.
     * mappedBy indica la propiedad dueña de la relación en Cita.java.
     */
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Ignorar al serializar para evitar bucles infinitos
    private List<Cita> citas;
    // ------------------------------------------------------------------
}