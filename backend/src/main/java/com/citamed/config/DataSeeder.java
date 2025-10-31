package com.citamed.config;

import com.citamed.domain.patient.PacienteRepository;
import com.citamed.domain.user.Rol;
import com.citamed.domain.user.Usuario;
import com.citamed.domain.user.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * (FASE 2.1) Pobla la base de datos con datos de prueba
 * si la base de datos está vacía.
 */
@Component
@RequiredArgsConstructor
@Slf4j // Para logging
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Iniciando DataSeeder...");

        // 1. Crear Usuario ADMIN
        // (Debe crearse manualmente con UsuarioRepository
        // ya que sp_RegistrarPaciente hardcodea el ROL 'PACIENTE')
        if (usuarioRepository.findByEmail("admin@cmed.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setEmail("admin@cmed.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMIN);
            admin.setEstaActivo(true);
            usuarioRepository.save(admin);
            log.info("Usuario ADMIN creado: admin@cmed.com");
        } else {
            log.info("Usuario ADMIN ya existe.");
        }

        // 2. Crear Usuario PACIENTE 1
        if (usuarioRepository.findByEmail("paciente1@gmail.com").isEmpty()) {
            pacienteRepository.registrarPaciente(
                    "paciente1@gmail.com",
                    passwordEncoder.encode("paciente123"),
                    "11111111", // DNI (Placeholder)
                    "Paciente Uno", // Nombres (Placeholder)
                    "Demo", // Apellidos (Placeholder)
                    "999111111" // Telefono (Placeholder)
            );
            log.info("Usuario PACIENTE 1 creado: paciente1@gmail.com");
        } else {
            log.info("Usuario PACIENTE 1 ya existe.");
        }

        // 3. Crear Usuario PACIENTE 2
        if (usuarioRepository.findByEmail("paciente2@gmail.com").isEmpty()) {
            pacienteRepository.registrarPaciente(
                    "paciente2@gmail.com",
                    passwordEncoder.encode("paciente123"),
                    "22222222", // DNI (Placeholder)
                    "Paciente Dos", // Nombres (Placeholder)
                    "Demo", // Apellidos (Placeholder)
                    "999222222" // Telefono (Placeholder)
            );
            log.info("Usuario PACIENTE 2 creado: paciente2@gmail.com");
        } else {
            log.info("Usuario PACIENTE 2 ya existe.");
        }

        log.info("DataSeeder finalizado.");
    }
}