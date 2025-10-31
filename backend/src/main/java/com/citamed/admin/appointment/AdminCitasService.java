package com.citamed.admin.appointment;

import com.citamed.domain.appointment.Cita;
import com.citamed.domain.appointment.CitaRepository;
import com.citamed.domain.patient.Paciente;
import com.citamed.patient.dtos.CitaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja la gestión global de citas para el rol ADMIN.
 */
@Service
@RequiredArgsConstructor
public class AdminCitasService {

    private final CitaRepository citaRepository;

    /**
     * (Punto 5.2.2) Obtiene todas las citas del sistema (con filtros opcionales).
     */
    @Transactional(readOnly = true)
    public List<CitaResponseDTO> findAllCitas(
            String fechaInicio, String fechaFin, Integer idMedico) {

        // Llama al SP que devuelve el historial completo
        List<Cita> citas = citaRepository.spAdminListarTodasCitas(fechaInicio, fechaFin, idMedico);

        // Mapea la lista de Entidades a DTOs enriquecidos para Admin
        return citas.stream().map(cita -> {
            Paciente paciente = cita.getPaciente();

            return CitaResponseDTO.builder()
                    .idCita(cita.getIdCita())
                    .fechaHora(cita.getFechaHora())
                    .estado(cita.getEstado())
                    .idMedico(cita.getMedico().getIdMedico())
                    .medicoNombres(cita.getMedico().getNombres())
                    .medicoApellidos(cita.getMedico().getApellidos())
                    .especialidad(cita.getMedico().getEspecialidad())
                    .idPaciente(paciente.getIdPaciente())
                    .pacienteNombres(paciente.getNombres())
                    .pacienteApellidos(paciente.getApellidos())
                    .pacienteDni(paciente.getDni())
                    .pacienteEmail(paciente.getUsuario().getEmail()) // Se accede al email a través de la relación
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * (Punto 5.2.2) Cancela una cita por el Admin (cambia estado a CANCELADA_ADMIN).
     */
    @Transactional
    public void adminCancelarCita(Integer idCita) {
        // Llama al SP de cancelación de Admin (sin verificación de propiedad)
        citaRepository.spAdminCancelarCita(idCita);
    }
}