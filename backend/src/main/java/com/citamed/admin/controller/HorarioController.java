package com.citamed.admin.controller;

import com.citamed.admin.dtos.HorarioMedicoResponseDTO;
import com.citamed.admin.dtos.UpsertHorarioRequestDTO;
import com.citamed.admin.schedule.HorarioService;
import jakarta.validation.Valid; // Para activar las validaciones del DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * (Punto 3.4.8) API REST para la gestión de Horarios de Médicos.
 * Protegido solo para el rol 'ADMIN'.
 */
@RestController
@RequestMapping("/admin/horarios") // Ruta base
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Protege toda la clase
public class HorarioController {

    private final HorarioService horarioService;

    /**
     * (Punto 3.4.9) Endpoint GET para listar todos los horarios de UN médico.
     * Se pasa el id del médico como parámetro de consulta (Query Param).
     * Ruta: GET /api/admin/horarios?medicoId=123
     */
    @GetMapping
    public ResponseEntity<List<HorarioMedicoResponseDTO>> getHorariosPorMedico(
            @RequestParam Integer medicoId) {

        List<HorarioMedicoResponseDTO> horarios = horarioService.findByMedico(medicoId);
        return ResponseEntity.ok(horarios);
    }

    /**
     * (Punto 3.4.9) Endpoint POST para crear/actualizar (Upsert) un horario.
     * El ID del médico al que pertenece el horario se pasa en la URL.
     * Ruta: POST /api/admin/horarios/{idMedico}
     *
     * @Valid activa el GlobalExceptionHandler si la validación falla
     * (incluyendo la lógica de negocio del HorarioService).
     */
    @PostMapping("/{idMedico}")
    public ResponseEntity<Void> upsertHorario(
            @PathVariable Integer idMedico,
            @Valid @RequestBody UpsertHorarioRequestDTO request) {

        horarioService.upsert(idMedico, request);
        return ResponseEntity.status(HttpStatus.OK).build(); // 200 OK (o 201 si prefieres)
    }

    /**
     * (Punto 3.4.9) Endpoint DELETE para eliminar (Hard Delete) un horario.
     * Se elimina por el ID del horario (PK), no por el ID del médico.
     * Ruta: DELETE /api/admin/horarios/{idHorario}
     */
    @DeleteMapping("/{idHorario}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
    public void deleteHorario(@PathVariable Integer idHorario) {
        horarioService.delete(idHorario);
    }
}