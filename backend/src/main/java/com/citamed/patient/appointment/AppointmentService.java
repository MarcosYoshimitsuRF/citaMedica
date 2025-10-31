package com.citamed.patient.appointment;

import com.citamed.domain.appointment.Cita;
import com.citamed.domain.appointment.CitaRepository;
import com.citamed.patient.dtos.AgendarCitaRequest;
import com.citamed.patient.dtos.CitaResponseDTO;
import com.citamed.patient.doctor.DoctorService; // Importar servicio de Doctor
import com.citamed.patient.dtos.DoctorResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la lógica de agendamiento y gestión de citas
 * para el rol PACIENTE.
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final CitaRepository citaRepository;
    private final DoctorService doctorService; // Inyectado para mapeo

    /**
     * Agenda una nueva cita (Punto 4.3.5).
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
     */
    @Transactional(readOnly = true)
    public List<CitaResponseDTO> findCitasByPaciente(Integer idPaciente) {
        // Llama al SP que filtra por id_paciente (Segregación de Datos)
        List<Cita> citas = citaRepository.spObtenerCitasPorPaciente(idPaciente);

        // Mapea la lista de Entidades a DTOs enriquecidos
        return citas.stream().map(cita -> {
            // Reutilizamos el mapeo de Medico (aunque aquí solo necesitamos el ID/Nombres)
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
     * El idPaciente se usa en el Repositorio para la validación de propiedad.
     */
    @Transactional
    public void cancelarCitaPaciente(Integer idCita, Integer idPaciente) {
        // El SP verifica que la cita pertenezca al paciente antes de actualizar
        citaRepository.spCancelarCitaPaciente(idCita, idPaciente);
    }
}