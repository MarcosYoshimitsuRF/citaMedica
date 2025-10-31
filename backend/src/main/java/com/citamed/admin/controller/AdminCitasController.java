package com.citamed.admin.controller;

import com.citamed.admin.appointment.AdminCitasService;
import com.citamed.patient.dtos.CitaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * (Punto 5.2.2) Controlador para la gestión global de Citas (Rol ADMIN).
 */
@RestController
@RequestMapping("/admin/citas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCitasController {

    private final AdminCitasService adminCitasService;

    /**
     * (Punto 5.2.3) Endpoint GET para listar todas las citas.
     * Ruta: GET /api/admin/citas/todas
     */
    @GetMapping("/todas")
    public ResponseEntity<List<CitaResponseDTO>> getAllCitas(
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin,
            @RequestParam(required = false) Integer idMedico) {

        List<CitaResponseDTO> citas = adminCitasService.findAllCitas(
                fechaInicio,
                fechaFin,
                idMedico
        );
        return ResponseEntity.ok(citas);
    }

    /**
     * (Punto 5.2.3) Endpoint PUT para cancelar una cita por el Admin.
     * Ruta: PUT /api/admin/citas/{id}/cancelar
     */
    @PutMapping("/{idCita}/cancelar")
    public ResponseEntity<Void> cancelarCitaAdmin(@PathVariable Integer idCita) {

        adminCitasService.adminCancelarCita(idCita);
        return ResponseEntity.ok().build();
    }
}