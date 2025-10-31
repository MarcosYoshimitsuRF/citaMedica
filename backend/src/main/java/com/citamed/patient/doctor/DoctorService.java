package com.citamed.patient.doctor;

import com.citamed.admin.dtos.shared.ConsultorioInfoDTO;
import com.citamed.domain.doctor.Medico;
import com.citamed.domain.doctor.MedicoRepository;
import com.citamed.domain.office.Consultorio;
import com.citamed.patient.dtos.DoctorResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importación necesaria

import java.time.LocalDate;
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

    /**
     * Obtiene la lista de médicos disponibles para el paciente.
     * Llama a sp_ListarMedicosPublico.
     */
    // --- CORRECCIÓN FINAL: Transactional sin readOnly=true ---
    // Esto asegura que se abra una transacción completa para el SP de consulta
    @Transactional
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
     * Llama a sp_ObtenerSlotsDisponibles.
     */
    @Transactional
    public List<String> getAvailableSlots(Integer idMedico, LocalDate fecha) {
        List<String> slotsRaw = medicoRepository.spObtenerSlotsDisponibles(idMedico, fecha);

        return slotsRaw.stream()
                .map(timeStr -> timeStr.substring(0, 5))
                .collect(Collectors.toList());
    }

    // ... (mapToResponseDTO)
    private DoctorResponseDTO mapToResponseDTO(Medico medico) {
        DoctorResponseDTO dto = new DoctorResponseDTO();
        dto.setIdMedico(medico.getIdMedico());
        dto.setNombres(medico.getNombres());
        dto.setApellidos(medico.getApellidos());
        dto.setEspecialidad(medico.getEspecialidad());

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