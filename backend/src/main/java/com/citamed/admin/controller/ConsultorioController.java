package com.citamed.admin.controller;

import com.citamed.admin.dtos.ConsultorioResponseDTO;
import com.citamed.admin.dtos.CreateConsultorioRequest;
import com.citamed.admin.dtos.UpdateConsultorioRequest;
import com.citamed.admin.office.ConsultorioService;
import jakarta.validation.Valid; // Para activar las validaciones del DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * (Punto 3.4.2) API REST para la gestión de Consultorios.
 * Protegido solo para el rol 'ADMIN'.
 */
@RestController
@RequestMapping("/admin/consultorios") // Ruta base [cite: 217]
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // (Punto 3.4.2) Protege toda la clase
public class ConsultorioController {

    private final ConsultorioService consultorioService;

    /**
     * (Punto 3.4.3) Endpoint GET para listar todos los consultorios.
     */
    @GetMapping
    public ResponseEntity<List<ConsultorioResponseDTO>> getAllConsultorios() {
        List<ConsultorioResponseDTO> consultorios = consultorioService.findAll();
        return ResponseEntity.ok(consultorios);
    }

    /**
     * (Punto 3.4.3) Endpoint POST para crear un nuevo consultorio.
     * @Valid activa el GlobalExceptionHandler si la validación falla.
     */
    @PostMapping
    public ResponseEntity<Void> createConsultorio(@Valid @RequestBody CreateConsultorioRequest request) {
        consultorioService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * (Punto 3.4.3) Endpoint PUT para actualizar un consultorio.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateConsultorio(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateConsultorioRequest request) {

        consultorioService.update(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * (Punto 3.4.3) Endpoint DELETE para desactivar (Soft Delete) un consultorio.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
    public void deleteConsultorio(@PathVariable Integer id) {
        consultorioService.delete(id);
    }
}