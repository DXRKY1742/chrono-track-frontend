// src/services/collaboratorService.js
import { baseService } from "./baseService";

const collaboratorService = {
  fetchCollaborators: () => baseService.getPaginated('collaborators','', { page: 1, limit: 10 }),

  patchCollaborator: (id, body) => baseService.patch('collaborators', `${id}`, body),

  deleteCollaborator: (id) => baseService.delete('collaborators', `${id}`),

};

export default collaboratorService;
