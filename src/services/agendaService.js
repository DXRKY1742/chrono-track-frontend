// src/services/agendaService.js
import { baseService } from "./baseService";

// http://localhost:3000/api/agendas/1/tasks?page=1&limit=1

const agendaService = {
  fetchAgendas: () => baseService.getPaginated('agendas', 'assigned', { page: 1, limit: 10 }),
  fetchTasksByAgendaId: (id) => baseService.getPaginated('agendas', `${id}/tasks`, { page: 1, limit: 10}),
  fetchCollaboratorsByAgendaId: (id) => baseService.getPaginated('agendas', `${id}/collaborators`, { page: 1, limit: 10}),

  postAgenda: (body) => baseService.post('agendas', body),
  postTaskToAgenda: (id, body) => baseService.post('agendas', `${id}/tasks`, body),
  postCollaboratorToAgenda: (id, body) => baseService.post('agendas', `${id}/collaborators`, body),

  patchAgenda: (id, body) => baseService.patch('agendas', `${id}`, body),

  deleteAgenda: (id) => baseService.delete('agendas', `${id}`),

}

export default agendaService;
