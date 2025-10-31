package com.citamed.config;

import com.citamed.domain.user.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Implementación de UserDetailsService que carga el usuario
 * llamando al SP 'sp_ObtenerUsuarioPorEmail' (a través del repositorio).
 * Esta clase es instanciada como un Bean en AppConfig.
 */
@RequiredArgsConstructor
public class ApplicationUserDetailsService implements UserDetailsService {

    // Esta dependencia es inyectada por el @Bean en AppConfig
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // El 'username' de Spring Security es nuestro 'email'
        // Llama al método del repositorio que ejecuta el SP
        return usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + username));
    }
}