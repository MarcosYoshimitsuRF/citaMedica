package com.citamed.patient.doctor;

import com.citamed.patient.dtos.DoctorResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * (Punto 4.3.2) Controlador para la consulta de Médicos y Disponibilidad (Slot Generator).
 * Protegido solo para el rol 'PACIENTE'.
 */
@RestController
@RequestMapping("/medicos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PACIENTE')")
public class DoctorController {

    private final DoctorService doctorService;

    /**
     * (Punto 4.3.3) Endpoint GET para listar médicos activos para el agendamiento.
     * Ruta: GET /api/medicos
     */
    @GetMapping
    public ResponseEntity<List<DoctorResponseDTO>> getAllMedicos() {
        List<DoctorResponseDTO> medicos = doctorService.findAllPublic();
        return ResponseEntity.ok(medicos);
    }

    /**
     * (Punto 4.3.4) Endpoint GET para obtener slots disponibles (El Slot Generator).
     * Ruta: GET /api/medicos/{id}/disponibilidad?fecha=YYYY-MM-DD
     */
    @GetMapping("/{idMedico}/disponibilidad")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Integer idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        List<String> slots = doctorService.getAvailableSlots(idMedico, fecha);
        return ResponseEntity.ok(slots);
    }
}