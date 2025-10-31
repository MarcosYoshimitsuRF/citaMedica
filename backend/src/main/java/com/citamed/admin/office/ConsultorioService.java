package com.citamed.admin.office;

// Importación necesaria para la transacción
import org.springframework.transaction.annotation.Transactional;

import com.citamed.admin.dtos.ConsultorioResponseDTO;
import com.citamed.admin.dtos.CreateConsultorioRequest;
import com.citamed.admin.dtos.UpdateConsultorioRequest;
import com.citamed.domain.office.Consultorio;
import com.citamed.domain.office.ConsultorioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio (capa de negocio) para la gestión de Consultorios.
 * (Corregido: @Transactional sin readOnly=true para SPs de SELECT).
 */
@Service
@RequiredArgsConstructor
public class ConsultorioService {

    private final ConsultorioRepository consultorioRepository;

    /**
     * Obtiene todos los consultorios (activos e inactivos).
     * @return Lista de DTOs de respuesta.
     */
    // --- INICIO DE LA CORRECCIÓN ---
    // Los SPs de SELECT en MySQL/JPA a veces requieren una
    // transacción completa (no-read-only) para ejecutarse correctamente.
    @Transactional
    // --- FIN DE LA CORRECCIÓN ---
    public List<ConsultorioResponseDTO> findAll() {
        // 1. Llama al SP
        List<Consultorio> consultorios = consultorioRepository.spAdminListarConsultorios();

        // 2. Mapea la lista de Entidades a una lista de DTOs
        return consultorios.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo consultorio.
     */
    @Transactional
    public void create(CreateConsultorioRequest request) {
        consultorioRepository.spAdminCrearConsultorio(
                request.getNombre(),
                request.getUbicacion()
        );
    }

    /**
     * Actualiza un consultorio existente.
     */
    @Transactional
    public void update(Integer id, UpdateConsultorioRequest request) {
        consultorioRepository.spAdminActualizarConsultorio(
                id,
                request.getNombre(),
                request.getUbicacion(),
                request.getEstaActivo()
        );
    }

    /**
     * Realiza un Soft Delete de un consultorio.
     */
    @Transactional
    public void delete(Integer id) {
        consultorioRepository.spAdminEliminarConsultorio(id);
    }

    /**
     * Método de mapeo privado (Rol Senior).
     * Convierte una Entidad 'Consultorio' a un 'ConsultorioResponseDTO'.
     */
    private ConsultorioResponseDTO mapToResponseDTO(Consultorio consultorio) {
        ConsultorioResponseDTO dto = new ConsultorioResponseDTO();
        dto.setIdConsultorio(consultorio.getIdConsultorio());
        dto.setNombre(consultorio.getNombre());
        dto.setUbicacion(consultorio.getUbicacion());
        dto.setEstaActivo(consultorio.isEstaActivo());
        return dto;
    }
}