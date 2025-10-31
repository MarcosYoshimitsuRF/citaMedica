package com.citamed.config;

// Importaciones añadidas
import com.citamed.domain.doctor.Medico;
import com.citamed.domain.doctor.MedicoRepository;
import com.citamed.domain.office.Consultorio;
import com.citamed.domain.office.ConsultorioRepository;
import com.citamed.domain.schedule.HorarioMedico;
import com.citamed.domain.schedule.HorarioMedicoRepository;
import java.sql.Time;
import java.util.Arrays;
// Fin de importaciones

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
 * (Actualizado FASE 3) Pobla la BD con datos de prueba
 * para Usuarios, Consultorios, Médicos y Horarios.
 */
@Component
@RequiredArgsConstructor
@Slf4j // Para logging
public class DataSeeder implements CommandLineRunner {

    // (FASE 1)
    private final UsuarioRepository usuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    // (FASE 3 - Punto 3.3.1) Inyecciones nuevas
    private final ConsultorioRepository consultorioRepository;
    private final MedicoRepository medicoRepository;
    private final HorarioMedicoRepository horarioMedicoRepository;


    @Override
    public void run(String... args) throws Exception {
        log.info("Iniciando DataSeeder...");

        // --- (FASE 1 / 2.1) Creación de Usuarios ---
        if (usuarioRepository.findByEmail("admin@cmed.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setEmail("admin@cmed.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMIN);
            admin.setEstaActivo(true);
            usuarioRepository.save(admin);
            log.info("Usuario ADMIN creado: admin@cmed.com");
        }
        if (usuarioRepository.findByEmail("paciente1@gmail.com").isEmpty()) {
            pacienteRepository.registrarPaciente(
                    "paciente1@gmail.com",
                    passwordEncoder.encode("paciente123"),
                    "11111111", "Paciente Uno", "Demo", "999111111"
            );
            log.info("Usuario PACIENTE 1 creado: paciente1@gmail.com");
        }
        if (usuarioRepository.findByEmail("paciente2@gmail.com").isEmpty()) {
            pacienteRepository.registrarPaciente(
                    "paciente2@gmail.com",
                    passwordEncoder.encode("paciente123"),
                    "22222222", "Paciente Dos", "Demo", "999222222"
            );
            log.info("Usuario PACIENTE 2 creado: paciente2@gmail.com");
        }

        // --- (FASE 3 - Punto 3.3.2) Creación de Consultorios, Médicos y Horarios ---
        // Se ejecuta solo si no hay consultorios
        if (consultorioRepository.count() == 0) {
            log.info("Poblando FASE 3: Consultorios, Médicos y Horarios...");

            // 1. Crear 2 Consultorios
            Consultorio c1 = new Consultorio();
            c1.setNombre("Consultorio 101");
            c1.setUbicacion("Piso 1, Ala Norte");
            consultorioRepository.save(c1);

            Consultorio c2 = new Consultorio();
            c2.setNombre("Consultorio 205");
            c2.setUbicacion("Piso 2, Ala Sur");
            consultorioRepository.save(c2);

            // 2. Crear 3 Médicos
            Medico m1 = new Medico();
            m1.setNombres("Dra. Ana");
            m1.setApellidos("Salazar");
            m1.setEspecialidad("Cardiología");
            m1.setConsultorio(c1); // Asignada al Consultorio 101
            medicoRepository.save(m1);

            Medico m2 = new Medico();
            m2.setNombres("Dr. Luis");
            m2.setApellidos("Mendoza");
            m2.setEspecialidad("Pediatría");
            m2.setConsultorio(c2); // Asignado al Consultorio 205
            medicoRepository.save(m2);

            Medico m3 = new Medico();
            m3.setNombres("Dr. Carlos");
            m3.setApellidos("Vidal");
            m3.setEspecialidad("Dermatología");
            m3.setConsultorio(c1); // Asignado al Consultorio 101
            medicoRepository.save(m3);

            // 3. Crear 5 Horarios_Medicos
            // (diaSemana: 1=Lunes, 2=Martes, 3=Miércoles, ...)

            // Dra. Salazar (Lunes 9-13)
            HorarioMedico h1 = new HorarioMedico();
            h1.setMedico(m1);
            h1.setDiaSemana((byte) 1);
            h1.setHoraInicio(Time.valueOf("09:00:00"));
            h1.setHoraFin(Time.valueOf("13:00:00"));

            // Dra. Salazar (Miércoles 9-13)
            HorarioMedico h2 = new HorarioMedico();
            h2.setMedico(m1);
            h2.setDiaSemana((byte) 3);
            h2.setHoraInicio(Time.valueOf("09:00:00"));
            h2.setHoraFin(Time.valueOf("13:00:00"));

            // Dr. Mendoza (Martes 14-18)
            HorarioMedico h3 = new HorarioMedico();
            h3.setMedico(m2);
            h3.setDiaSemana((byte) 2);
            h3.setHoraInicio(Time.valueOf("14:00:00"));
            h3.setHoraFin(Time.valueOf("18:00:00"));

            // Dr. Mendoza (Jueves 14-18)
            HorarioMedico h4 = new HorarioMedico();
            h4.setMedico(m2);
            h4.setDiaSemana((byte) 4);
            h4.setHoraInicio(Time.valueOf("14:00:00"));
            h4.setHoraFin(Time.valueOf("18:00:00"));

            // Dr. Vidal (Lunes 8-12)
            HorarioMedico h5 = new HorarioMedico();
            h5.setMedico(m3);
            h5.setDiaSemana((byte) 1);
            h5.setHoraInicio(Time.valueOf("08:00:00"));
            h5.setHoraFin(Time.valueOf("12:00:00"));

            horarioMedicoRepository.saveAll(Arrays.asList(h1, h2, h3, h4, h5));
            log.info("FASE 3 (Médicos, Horarios, Consultorios) poblada exitosamente.");
        } else {
            log.info("Datos de FASE 3 (Médicos, Horarios) ya existen.");
        }

        log.info("DataSeeder finalizado.");
    }
}