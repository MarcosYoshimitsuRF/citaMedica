package com.citamed.auth;

import com.citamed.auth.dtos.AuthResponse;
import com.citamed.auth.dtos.LoginRequest;
import com.citamed.auth.dtos.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para los endpoints de Autenticación.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint para el login de usuarios (Punto 1.8.2).
     * Mapea: POST /api/auth/login
     *
     * @param request DTO con email y password.
     * @return ResponseEntity 200 OK con el AuthResponse (token).
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Delega la lógica al servicio y devuelve el token
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Endpoint para el registro de nuevos pacientes (Punto 1.8.3).
     * Mapea: POST /api/auth/register
     *
     * @param request DTO con datos de registro.
     * @return ResponseEntity 200 OK (sin cuerpo).
     */
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        // Delega la lógica al servicio
        authService.register(request);
        // Devuelve 200 OK
        return ResponseEntity.ok().build();
    }
}