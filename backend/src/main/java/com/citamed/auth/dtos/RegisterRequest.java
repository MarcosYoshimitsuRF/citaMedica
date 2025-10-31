package com.citamed.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la solicitud de registro (POST /api/auth/register).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    // Datos para Pacientes
    private String dni;
    private String nombres;
    private String apellidos;
    private String telefono;

    // Datos para Usuarios
    private String email;
    private String password;
}