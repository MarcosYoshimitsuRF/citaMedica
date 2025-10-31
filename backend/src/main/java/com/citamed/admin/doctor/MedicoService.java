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
// Importación necesaria para la transacción
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio (capa de negocio) para la gestión de Médicos.
 * (CORREGIDO: Añadido @Transactional al findAll).
 */
@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;

    /**
     * Obtiene todos los médicos (activos e inactivos).
     * @return Lista de DTOs de respuesta.
     */
    // --- CORRECCIÓN: @Transactional es OBLIGATORIO para SPs de SELECT ---
    @Transactional
    public List<MedicoResponseDTO> findAll() {
        // 1. Llama al SP
        List<Medico> medicos = medicoRepository.spAdminListarMedicos();
        // 2. Mapea la lista de Entidades a una lista de DTOs
        return medicos.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // El resto de los métodos (create, update, delete) son correctos con @Transactional
    // en la capa de servicio.

    /**
     * Crea un nuevo médico.
     */
    @Transactional
    public void create(CreateMedicoRequest request) {
        medicoRepository.spAdminCrearMedico(
                request.getNombres(),
                request.getApellidos(),
                request.getEspecialidad(),
                request.getIdConsultorioAsignado()
        );
    }

    /**
     * Actualiza un médico existente.
     */
    @Transactional
    public void update(Integer id, UpdateMedicoRequest request) {
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
     */
    @Transactional
    public void delete(Integer id) {
        medicoRepository.spAdminEliminarMedico(id);
    }


    /**
     * Método de mapeo privado (Rol Senior).
     */
    private MedicoResponseDTO mapToResponseDTO(Medico medico) {
        MedicoResponseDTO dto = new MedicoResponseDTO();
        dto.setIdMedico(medico.getIdMedico());
        dto.setNombres(medico.getNombres());
        dto.setApellidos(medico.getApellidos());
        dto.setEspecialidad(medico.getEspecialidad());
        dto.setEstaActivo(medico.isEstaActivo());

        if (medico.getConsultorio() != null) {
            Consultorio consultorio = medico.getConsultorio();
            ConsultorioInfoDTO consultorioDTO = new ConsultorioInfoDTO();
            consultorioDTO.setIdConsultorio(consultorio.getIdConsultorio());
            consultorioDTO.setNombre(consultorio.getNombre());
            dto.setConsultorio(consultorioDTO);
        } else {
            dto.setConsultorio(null);
        }

        return dto;
    }
}