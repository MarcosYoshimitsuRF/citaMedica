package com.citamed.patient.appointment;

import com.citamed.patient.dtos.AgendarCitaRequest;
import com.citamed.domain.user.Usuario;
import com.citamed.patient.dtos.CitaResponseDTO; // Importado
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de citas por parte del Paciente.
 */
@RestController
@RequestMapping("/citas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PACIENTE')")
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * Endpoint POST para agendar una nueva cita (FASE 4).
     */
    @PostMapping
    public ResponseEntity<Void> agendarCita(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody AgendarCitaRequest request) {

        Integer idPaciente = usuario.getPaciente().getIdPaciente();
        appointmentService.agendarCita(idPaciente, request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ------------------------------------------------------------------
    // NUEVOS ENDPOINTS DE GESTIÓN (FASE 5)
    // ------------------------------------------------------------------

    /**
     * (Punto 5.2.1) Endpoint GET para obtener las citas del paciente logueado.
     * Ruta: GET /api/citas/mis-citas
     * Implementa Segregación de Datos.
     */
    @GetMapping("/mis-citas")
    public ResponseEntity<List<CitaResponseDTO>> getMisCitas(
            @AuthenticationPrincipal Usuario usuario) {

        // Segregación: Solo se usa el ID del paciente del token
        Integer idPaciente = usuario.getPaciente().getIdPaciente();
        List<CitaResponseDTO> citas = appointmentService.findCitasByPaciente(idPaciente);

        return ResponseEntity.ok(citas);
    }

    /**
     * (Punto 5.2.1) Endpoint PUT para cancelar una cita.
     * Ruta: PUT /api/citas/{id}/cancelar
     * Implementa Segregación de Datos y validación de propiedad.
     */
    @PutMapping("/{idCita}/cancelar")
    public ResponseEntity<Void> cancelarCita(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Integer idCita) {

        // Segregación: Se pasa el idCita Y el idPaciente para que el SP verifique la propiedad
        Integer idPaciente = usuario.getPaciente().getIdPaciente();
        appointmentService.cancelarCitaPaciente(idCita, idPaciente);

        return ResponseEntity.ok().build();
    }
}