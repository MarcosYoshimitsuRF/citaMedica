package com.citamed.admin.controller;

import com.citamed.admin.doctor.MedicoService;
import com.citamed.admin.dtos.CreateMedicoRequest;
import com.citamed.admin.dtos.MedicoResponseDTO;
import com.citamed.admin.dtos.UpdateMedicoRequest;
import jakarta.validation.Valid; // Para activar las validaciones del DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * (Punto 3.4.5) API REST para la gestión de Médicos.
 * Protegido solo para el rol 'ADMIN'.
 */
@RestController
@RequestMapping("/admin/medicos") // Ruta base
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // (Punto 3.4.5) Protege toda la clase
public class MedicoController {

    private final MedicoService medicoService;

    /**
     * (Punto 3.4.6) Endpoint GET para listar todos los médicos.
     */
    @GetMapping
    public ResponseEntity<List<MedicoResponseDTO>> getAllMedicos() {
        List<MedicoResponseDTO> medicos = medicoService.findAll();
        return ResponseEntity.ok(medicos);
    }

    /**
     * (Punto 3.4.6) Endpoint POST para crear un nuevo médico.
     * @Valid activa el GlobalExceptionHandler si la validación falla.
     */
    @PostMapping
    public ResponseEntity<Void> createMedico(@Valid @RequestBody CreateMedicoRequest request) {
        medicoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * (Punto 3.4.6) Endpoint PUT para actualizar un médico.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateMedico(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateMedicoRequest request) {

        medicoService.update(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * (Punto 3.4.6) Endpoint DELETE para desactivar (Soft Delete) un médico.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
    public void deleteMedico(@PathVariable Integer id) {
        medicoService.delete(id);
    }
}