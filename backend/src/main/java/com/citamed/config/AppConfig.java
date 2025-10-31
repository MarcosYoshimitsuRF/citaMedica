package com.citamed.config;

// Importaciones añadidas
import com.citamed.domain.user.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
// Fin de importaciones añadidas

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuración de Beans esenciales para Spring Security.
 * (Actualizado para exponer el UserDetailsService y AuthenticationProvider).
 */
@Configuration
@RequiredArgsConstructor
public class AppConfig {

    // Inyectamos el repositorio para pasarlo al UserDetailsService
    private final UsuarioRepository usuarioRepository;

    /**
     * (Punto 1.2.1) Define el Bean para encriptar contraseñas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * (Punto 1.2.2) Define el Bean de AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Expone el Bean de UserDetailsService.
     * Utiliza la clase que creamos en el paso 1.7.7.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new ApplicationUserDetailsService(this.usuarioRepository);
    }

    /**
     * Bean de AuthenticationProvider.
     * Conecta el UserDetailsService (cómo cargar usuarios)
     * con el PasswordEncoder (cómo verificar contraseñas).
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}