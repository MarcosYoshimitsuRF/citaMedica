package com.citamed.admin.patient;

import com.citamed.admin.dtos.PacienteResponseDTO;
import com.citamed.admin.dtos.UpdatePacienteRequest;
import com.citamed.domain.patient.Paciente;
import com.citamed.domain.patient.PacienteRepository;
import com.citamed.domain.user.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de negocio para el CRUD de Pacientes (Rol Admin).
 */
@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Lista todos los pacientes (activos/inactivos) llamando al SP.
     */
    @Transactional(readOnly = true)
    public List<PacienteResponseDTO> findAll() {
        // Llama al SP que devuelve la entidad Paciente enriquecida con datos de Usuario
        List<Paciente> pacientes = pacienteRepository.spAdminListarPacientes();

        // Mapea la lista de Entidades a DTOs de respuesta
        return pacientes.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza los datos demográficos del paciente (Punto 6.2.2).
     */
    @Transactional
    public void update(Integer idPaciente, UpdatePacienteRequest request) {
        pacienteRepository.spAdminActualizarPaciente(
                idPaciente,
                request.getDni(),
                request.getNombres(),
                request.getApellidos(),
                request.getTelefono()
        );
    }

    /**
     * Elimina lógicamente (Soft Delete) la cuenta de un paciente (Punto 6.2.2).
     */
    @Transactional
    public void delete(Integer idPaciente) {
        usuarioRepository.spAdminEliminarPaciente(idPaciente);
    }

    /**
     * Mapea la Entidad Paciente enriquecida a PacienteResponseDTO.
     */
    private PacienteResponseDTO mapToResponseDTO(Paciente paciente) {
        PacienteResponseDTO dto = new PacienteResponseDTO();

        dto.setIdPaciente(paciente.getIdPaciente());
        dto.setDni(paciente.getDni());
        dto.setNombres(paciente.getNombres());
        dto.setApellidos(paciente.getApellidos());
        dto.setTelefono(paciente.getTelefono()); // <-- La llamada es correcta

        // Datos de Usuario (se acceden a través de la relación)
        if (paciente.getUsuario() != null) {
            dto.setEmail(paciente.getUsuario().getEmail());
            dto.setEstaActivo(paciente.getUsuario().isEstaActivo());
        }

        return dto;
    }
}