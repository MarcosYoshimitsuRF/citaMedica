package com.citamed.admin.controller;

import com.citamed.admin.dtos.PacienteResponseDTO;
import com.citamed.admin.dtos.UpdatePacienteRequest;
import com.citamed.admin.patient.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * (Punto 6.2.1) API REST para la gestión de Pacientes (Rol Admin).
 * Protegido solo para el rol 'ADMIN'.
 */
@RestController
@RequestMapping("/admin/pacientes") // Ruta base
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PacienteController {

    private final PacienteService pacienteService;

    /**
     * (Punto 6.2.2) Endpoint GET para listar todos los pacientes.
     */
    @GetMapping
    public ResponseEntity<List<PacienteResponseDTO>> getAllPacientes() {
        List<PacienteResponseDTO> pacientes = pacienteService.findAll();
        return ResponseEntity.ok(pacientes);
    }

    /**
     * (Punto 6.2.2) Endpoint PUT para actualizar un paciente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePaciente(
            @PathVariable Integer id,
            @Valid @RequestBody UpdatePacienteRequest request) {

        pacienteService.update(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * (Punto 6.2.2) Endpoint DELETE para desactivar (Soft Delete) un paciente.
     * Desactiva el usuario asociado, bloqueando el login.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
    public void deletePaciente(@PathVariable Integer id) {
        pacienteService.delete(id);
    }
}