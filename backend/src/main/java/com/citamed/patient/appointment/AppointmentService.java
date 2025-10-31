package com.citamed.patient.appointment;

import com.citamed.domain.appointment.CitaRepository;
import com.citamed.patient.dtos.AgendarCitaRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que maneja la lógica de agendamiento de citas
 * para el rol PACIENTE.
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final CitaRepository citaRepository;

    /**
     * Agenda una nueva cita (Punto 4.3.5).
     * El idPaciente se inyecta desde el SecurityContext.
     */
    @Transactional
    public void agendarCita(Integer idPaciente, AgendarCitaRequest request) {
        // Llama al SP (que internamente busca el id_consultorio)
        citaRepository.spAgendarCita(
                idPaciente,
                request.getIdMedico(),
                request.getFechaHora()
        );
    }
}