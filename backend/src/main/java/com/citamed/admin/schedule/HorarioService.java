package com.citamed.admin.schedule;

import com.citamed.admin.dtos.HorarioMedicoResponseDTO;
import com.citamed.admin.dtos.UpsertHorarioRequestDTO;
import com.citamed.domain.schedule.HorarioMedico;
import com.citamed.domain.schedule.HorarioMedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio (capa de negocio) para la gestión de Horarios.
 * Es llamado por el Controlador y llama al Repositorio (SPs).
 * Incluye la validación de negocio de los rangos horarios.
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
     * @param idMedico El ID del médico (de la URL).
     * @param request DTO con los datos del horario (del body).
     */
    public void upsert(Integer idMedico, UpsertHorarioRequestDTO request) {

        // (Orden 3) Validación de Negocio (Punto 3.4.7 DTO Nota)
        // El SP tiene un CHK, pero validamos aquí para dar un error 400 claro.
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
     * @param idHorario El ID del horario a eliminar.
     */
    public void delete(Integer idHorario) {
        // Llama al SP de eliminación (Hard Delete)
        horarioMedicoRepository.spAdminEliminarHorario(idHorario);
    }


    /**
     * Método de mapeo privado (Rol Senior).
     * Convierte una Entidad 'HorarioMedico' a un 'HorarioMedicoResponseDTO'.
     */
    private HorarioMedicoResponseDTO mapToResponseDTO(HorarioMedico horario) {
        HorarioMedicoResponseDTO dto = new HorarioMedicoResponseDTO();
        dto.setIdHorario(horario.getIdHorario());
        dto.setIdMedico(horario.getMedico().getIdMedico()); // Obtiene el ID del objeto Medico
        dto.setDiaSemana(horario.getDiaSemana());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        dto.setEstaActivo(horario.isEstaActivo());
        return dto;
    }
}