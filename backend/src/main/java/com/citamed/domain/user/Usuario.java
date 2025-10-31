package com.citamed.domain.user;

// Import Paciente para la nueva relación
import com.citamed.domain.patient.Paciente;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entidad que mapea la tabla 'Usuarios' y gestiona la autenticación.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    @JsonIgnore // Evita que el hash se serialize en respuestas JSON
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(name = "esta_activo", nullable = false)
    private boolean estaActivo;

    /**
     * Relación Uno-a-Uno (Inversa) con Paciente (Punto 1.3.8).
     * 'mappedBy = "usuario"' indica que la gestión de esta relación
     * (la FK) está en el campo 'usuario' de la clase 'Paciente'.
     * 'cascade = CascadeType.ALL' asegura que si se manipula un Usuario,
     * el Paciente asociado se vea afectado (útil para el registro).
     */
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Evita bucles infinitos de serialización
    private Paciente paciente;


    // --- Implementación de UserDetails (Punto 1.3.4) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getPassword() {
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.estaActivo;
    }
}