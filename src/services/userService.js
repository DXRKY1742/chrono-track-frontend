// src/services/userService.js
import { baseService } from "./baseService";

const userService = {
  fetchUsers: () => baseService.getPaginated('users','', { page: 1, limit: 10 }),

  patchUser: (id, body) => baseService.patch('users', `${id}`, body),

  deleteUser: (id) => baseService.delete('users', `${id}`),

};

export default userService;
