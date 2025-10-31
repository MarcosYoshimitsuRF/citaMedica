package com.citamed.auth;

import com.citamed.auth.dtos.AuthResponse;
import com.citamed.auth.dtos.LoginRequest;
import com.citamed.auth.dtos.RegisterRequest;
import com.citamed.config.JwtService;
import com.citamed.domain.patient.PacienteRepository;
import com.citamed.domain.user.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio que maneja la lógica de negocio para
 * el registro de pacientes y el login de usuarios.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    // Dependencias inyectadas
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Procesa la solicitud de login (Punto 1.7.5).
     *
     * @param request DTO con email y password.
     * @return DTO con el token JWT.
     */
    public AuthResponse login(LoginRequest request) {
        // 1. Spring Security (AuthenticationManager) valida email y password.
        // Esto usará internamente nuestro ApplicationUserDetailsService
        // y PasswordEncoder (que definimos en AppConfig).
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Si la autenticación fue exitosa, buscamos al usuario
        // (necesario para obtener el ID y Rol para el token).
        // Usamos el SP que ya definimos en el repositorio.
        UserDetails userDetails = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticación")); // No debería ocurrir

        // 3. Generar y devolver el token JWT
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }

    /**
     * Procesa la solicitud de registro (Punto 1.7.6).
     *
     * @param request DTO con datos de paciente y usuario.
     */
    public void register(RegisterRequest request) {
        // 1. Validar que el email no esté ya en uso
        usuarioRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new IllegalArgumentException("El email ya está registrado");
                });

        // 2. Encriptar la contraseña (usando el bean BCrypt)
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Llamar al SP (mapeado en PacienteRepository)
        // El SP maneja la transacción de insertar en Usuarios y Pacientes.
        pacienteRepository.registrarPaciente(
                request.getEmail(),
                hashedPassword,
                request.getDni(),
                request.getNombres(),
                request.getApellidos(),
                request.getTelefono()
        );

        // (Nota: El registro no devuelve token, el usuario debe hacer login).
    }
}