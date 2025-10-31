package com.citamed.patient.appointment;

import com.citamed.domain.appointment.Cita;
import com.citamed.domain.appointment.CitaRepository;
import com.citamed.patient.dtos.AgendarCitaRequest;
import com.citamed.patient.dtos.CitaResponseDTO;
import com.citamed.patient.doctor.DoctorService;
import com.citamed.patient.dtos.DoctorResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importación necesaria

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de agendamiento y gestión de citas
 * para el rol PACIENTE.
 * (Corregido para incluir @Transactional en findCitasByPaciente).
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final CitaRepository citaRepository;
    private final DoctorService doctorService;

    /**
     * Agenda una nueva cita (FASE 4).
     */
    @Transactional
    public void agendarCita(Integer idPaciente, AgendarCitaRequest request) {
        citaRepository.spAgendarCita(
                idPaciente,
                request.getIdMedico(),
                request.getFechaHora()
        );
    }

    /**
     * (Punto 5.2.1) Obtiene todas las citas de un paciente.
     * CORRECCIÓN: Se añade @Transactional.
     */
    @Transactional // <-- CORRECCIÓN AÑADIDA
    public List<CitaResponseDTO> findCitasByPaciente(Integer idPaciente) {
        // Llama al SP que filtra por id_paciente (Segregación de Datos)
        List<Cita> citas = citaRepository.spObtenerCitasPorPaciente(idPaciente);

        // Mapea la lista de Entidades a DTOs enriquecidos
        return citas.stream().map(cita -> {
            // Reutilizamos el mapeo de Medico
            DoctorResponseDTO doctorDto = doctorService.getDoctorDTOFromEntity(cita.getMedico());

            return CitaResponseDTO.builder()
                    .idCita(cita.getIdCita())
                    .fechaHora(cita.getFechaHora())
                    .estado(cita.getEstado())
                    .idMedico(cita.getMedico().getIdMedico())
                    .medicoNombres(doctorDto.getNombres())
                    .medicoApellidos(doctorDto.getApellidos())
                    .especialidad(doctorDto.getEspecialidad())
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * (Punto 5.2.1) Cancela una cita de paciente.
     */
    @Transactional
    public void cancelarCitaPaciente(Integer idCita, Integer idPaciente) {
        citaRepository.spCancelarCitaPaciente(idCita, idPaciente);
    }
}