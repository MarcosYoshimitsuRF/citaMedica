package com.citamed.domain.patient;

import com.citamed.domain.user.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(length = 8, nullable = false, unique = true)
    private String dni;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(length = 15)
    private String telefono;

    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo;

    /**
     * Relación Uno-a-Uno (Dueña) con Usuario.
     * 'FetchType.LAZY' optimiza la carga, trayendo al Usuario solo cuando se pide.
     * 'JoinColumn' especifica que esta tabla (Pacientes) tiene la FK 'id_usuario'.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;
}