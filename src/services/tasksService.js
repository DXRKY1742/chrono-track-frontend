// src/services/taskService.js
import { baseService } from "./baseService";

const taskService = {
  fetchAssigned: () => baseService.getPaginated('tasks', 'assigned', { page: 1, limit: 10 }),
  fetchAssignedPending: () => baseService.getPaginated('tasks', 'assigned/pending', { page: 1, limit: 10 }),
  fetchAssignedProgress: () => baseService.getPaginated('tasks', 'assigned/progress', { page: 1, limit: 10 }),
  fetchAssignedCompleted: () => baseService.getPaginated('tasks', 'assigned/completed', { page: 1, limit: 10 }),
  fetchAssignedDueToday: () => baseService.getPaginated('tasks', 'assigned/duetoday', { page: 1, limit: 10 }),
  fetchAssignedLate: () => baseService.getPaginated('tasks', 'assigned/late', { page: 1, limit: 10 }),
  fetchAssignedCreated: () => baseService.getPaginated('tasks', 'created', { page: 1, limit: 10 }),

  patchTask: (id, body) => baseService.patch('tasks', `${id}`, body),

  deleteTask: (id) => baseService.delete('tasks', `${id}`),

  getTaskComments: (id) => baseService.getPaginated('tasks', `${id}/comments`, { page: 1, limit: 1 }),

  postTaskComments: (id, body) => baseService.post('tasks', `${id}/comments`, body),
};

export default taskService;
