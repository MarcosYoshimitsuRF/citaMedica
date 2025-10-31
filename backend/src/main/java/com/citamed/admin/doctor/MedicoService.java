package com.citamed.admin.doctor;

import com.citamed.admin.dtos.CreateMedicoRequest;
import com.citamed.admin.dtos.MedicoResponseDTO;
import com.citamed.admin.dtos.UpdateMedicoRequest;
import com.citamed.admin.dtos.shared.ConsultorioInfoDTO;
import com.citamed.domain.doctor.Medico;
import com.citamed.domain.doctor.MedicoRepository;
import com.citamed.domain.office.Consultorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio (capa de negocio) para la gestión de Médicos.
 * Es llamado por el Controlador y llama al Repositorio (SPs).
 */
@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;

    /**
     * Obtiene todos los médicos (activos e inactivos).
     * @return Lista de DTOs de respuesta.
     */
    public List<MedicoResponseDTO> findAll() {
        // 1. Llama al SP
        List<Medico> medicos = medicoRepository.spAdminListarMedicos();

        // 2. Mapea la lista de Entidades a una lista de DTOs
        return medicos.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo médico.
     * @param request DTO con los datos de creación.
     */
    public void create(CreateMedicoRequest request) {
        // Llama al SP de creación
        medicoRepository.spAdminCrearMedico(
                request.getNombres(),
                request.getApellidos(),
                request.getEspecialidad(),
                request.getIdConsultorioAsignado()
        );
    }

    /**
     * Actualiza un médico existente.
     * @param id El ID del médico a actualizar.
     * @param request DTO con los nuevos datos.
     */
    public void update(Integer id, UpdateMedicoRequest request) {
        // Llama al SP de actualización
        medicoRepository.spAdminActualizarMedico(
                id,
                request.getNombres(),
                request.getApellidos(),
                request.getEspecialidad(),
                request.getIdConsultorioAsignado(),
                request.getEstaActivo()
        );
    }

    /**
     * Realiza un Soft Delete de un médico.
     * @param id El ID del médico a desactivar.
     */
    public void delete(Integer id) {
        // Llama al SP de eliminación (Soft Delete)
        medicoRepository.spAdminEliminarMedico(id);
    }


    /**
     * Método de mapeo privado (Rol Senior).
     * Convierte una Entidad 'Medico' a un 'MedicoResponseDTO'.
     * Maneja el caso de consultorios nulos.
     */
    private MedicoResponseDTO mapToResponseDTO(Medico medico) {
        MedicoResponseDTO dto = new MedicoResponseDTO();
        dto.setIdMedico(medico.getIdMedico());
        dto.setNombres(medico.getNombres());
        dto.setApellidos(medico.getApellidos());
        dto.setEspecialidad(medico.getEspecialidad());
        dto.setEstaActivo(medico.isEstaActivo());

        // (Rol Senior) Verificación de nulidad antes de mapear
        // el consultorio anidado para evitar NullPointerException.
        if (medico.getConsultorio() != null) {
            Consultorio consultorio = medico.getConsultorio();
            ConsultorioInfoDTO consultorioDTO = new ConsultorioInfoDTO();
            consultorioDTO.setIdConsultorio(consultorio.getIdConsultorio());
            consultorioDTO.setNombre(consultorio.getNombre());
            dto.setConsultorio(consultorioDTO);
        } else {
            dto.setConsultorio(null); // O un new ConsultorioInfoDTO() vacío si se prefiere
        }

        return dto;
    }
}