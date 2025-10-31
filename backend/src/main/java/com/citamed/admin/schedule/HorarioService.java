package com.citamed.admin.schedule;

import com.citamed.admin.dtos.HorarioMedicoResponseDTO;
import com.citamed.admin.dtos.UpsertHorarioRequestDTO;
import com.citamed.domain.schedule.HorarioMedico;
import com.citamed.domain.schedule.HorarioMedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importación necesaria

import java.sql.Time;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio (capa de negocio) para la gestión de Horarios.
 * (CORREGIDO: Añadido @Transactional al findByMedico).
 */
@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioMedicoRepository horarioMedicoRepository;

    /**
     * Obtiene todos los horarios de un médico específico.
     * @param idMedico El ID del médico.
     * @return Lista de DTOs de respuesta.
     */
    // --- CORRECCIÓN: @Transactional es OBLIGATORIO para SPs de SELECT ---
    @Transactional
    public List<HorarioMedicoResponseDTO> findByMedico(Integer idMedico) {
        // 1. Llama al SP
        List<HorarioMedico> horarios = horarioMedicoRepository.spAdminObtenerHorariosPorMedico(idMedico);

        // 2. Mapea la lista de Entidades a una lista de DTOs
        return horarios.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea o actualiza (Upsert) un horario para un médico.
     * (Ya es transaccional)
     */
    @Transactional
    public void upsert(Integer idMedico, UpsertHorarioRequestDTO request) {

        // Validación de Negocio: horaInicio < horaFin
        if (!request.getHoraInicio().before(request.getHoraFin())) {
            throw new IllegalArgumentException("La hora de inicio debe ser anterior a la hora de fin.");
        }

        // Llama al SP de Upsert
        horarioMedicoRepository.spAdminCrearHorario(
                idMedico,
                request.getDiaSemana(),
                request.getHoraInicio(),
                request.getHoraFin()
        );
    }

    /**
     * Realiza un Hard Delete de un horario.
     * (Ya es transaccional)
     */
    @Transactional
    public void delete(Integer idHorario) {
        // Llama al SP de eliminación (Hard Delete)
        horarioMedicoRepository.spAdminEliminarHorario(idHorario);
    }


    /**
     * Método de mapeo privado (Rol Senior).
     */
    private HorarioMedicoResponseDTO mapToResponseDTO(HorarioMedico horario) {
        HorarioMedicoResponseDTO dto = new HorarioMedicoResponseDTO();
        dto.setIdHorario(horario.getIdHorario());
        // Se asume que el médico existe, por eso se llama getMedico()
        dto.setIdMedico(horario.getMedico().getIdMedico());
        dto.setDiaSemana(horario.getDiaSemana());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        dto.setEstaActivo(horario.isEstaActivo());
        return dto;
    }
}