package com.citamed.patient.doctor;

import com.citamed.admin.dtos.shared.ConsultorioInfoDTO;
import com.citamed.domain.doctor.Medico;
import com.citamed.domain.doctor.MedicoRepository;
import com.citamed.domain.office.Consultorio;
import com.citamed.patient.dtos.DoctorResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de obtención de médicos y disponibilidad
 * para el rol PACIENTE (Slot Generator).
 */
@Service
@RequiredArgsConstructor
public class DoctorService {

    private final MedicoRepository medicoRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Obtiene la lista de médicos disponibles para el paciente.
     * Llama a sp_ListarMedicosPublico (Punto 4.2.3).
     */
    @Transactional(readOnly = true)
    public List<DoctorResponseDTO> findAllPublic() {
        // Llama al SP que filtra por esta_activo = 1
        List<Medico> medicos = medicoRepository.spListarMedicosPublico();

        // Mapea la lista de Entidades a una lista de DTOs
        return medicos.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Implementa la lógica del Slot Generator.
     * Llama a sp_ObtenerSlotsDisponibles (Punto 4.2.4).
     *
     * @param idMedico ID del médico.
     * @param fecha Fecha para buscar disponibilidad.
     * @return Lista de strings con los slots disponibles (Ej: "09:00").
     */
    @Transactional
    public List<String> getAvailableSlots(Integer idMedico, LocalDate fecha) {
        // 1. Llama al SP, el cual realiza toda la lógica de negocio
        // (Encontrar horario, generar slots de 30 min, filtrar CONFIRMADAS)
        List<String> slotsRaw = medicoRepository.spObtenerSlotsDisponibles(idMedico, fecha);

        // 2. Mapeamos el resultado TIME (HH:mm:ss) a formato simple HH:mm para el frontend
        return slotsRaw.stream()
                .map(timeStr -> {
                    // El resultado es "HH:mm:ss", lo truncamos a "HH:mm"
                    return timeStr.substring(0, 5);
                })
                .collect(Collectors.toList());
    }

    /**
     * Método de mapeo privado (Entidad Medico -> DoctorResponseDTO).
     */
    private DoctorResponseDTO mapToResponseDTO(Medico medico) {
        DoctorResponseDTO dto = new DoctorResponseDTO();
        dto.setIdMedico(medico.getIdMedico());
        dto.setNombres(medico.getNombres());
        dto.setApellidos(medico.getApellidos());
        dto.setEspecialidad(medico.getEspecialidad());

        // Incluir la info de consultorio si existe
        if (medico.getConsultorio() != null) {
            Consultorio consultorio = medico.getConsultorio();
            ConsultorioInfoDTO consultorioDTO = new ConsultorioInfoDTO();
            consultorioDTO.setIdConsultorio(consultorio.getIdConsultorio());
            consultorioDTO.setNombre(consultorio.getNombre());
            dto.setConsultorio(consultorioDTO);
        }
        return dto;
    }
}