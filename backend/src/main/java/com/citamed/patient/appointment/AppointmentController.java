package com.citamed.patient.appointment;

import com.citamed.patient.dtos.AgendarCitaRequest;
import com.citamed.domain.user.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * (Punto 4.3.1) Controlador para la gestión de citas por parte del Paciente.
 * Protegido solo para el rol 'PACIENTE'.
 */
@RestController
@RequestMapping("/citas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PACIENTE')")
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * (Punto 4.3.5) Endpoint POST para agendar una nueva cita.
     * Ruta: POST /api/citas
     * * Implementa la Segregación de Datos: extrae el id_paciente del JWT.
     */
    @PostMapping
    public ResponseEntity<Void> agendarCita(
            // Inyecta el objeto Usuario del contexto de seguridad (JWT)
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody AgendarCitaRequest request) {

        // 1. Obtener el ID del Paciente desde el token/usuario
        // La entidad Usuario tiene la relación Paciente
        Integer idPaciente = usuario.getPaciente().getIdPaciente();

        // 2. Ejecutar el servicio con el ID verificado
        appointmentService.agendarCita(idPaciente, request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // NOTA: Los endpoints GET /mis-citas y PUT /cancelar se implementarán en la FASE 5.
}