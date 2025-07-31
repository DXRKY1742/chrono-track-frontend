// src/services/categoryService.js
import { baseService } from "./baseService";

const categoryService = {
  fetchCategory: () => baseService.getPaginated('categories', { page: 1, limit: 10 }),
  postCategory: (body) => baseService.post('categories', body),
  patchCategory: (id, body) => baseService.patch('categories', `${id}`, body),
  deleteCategory: (id) => baseService.delete('categories', `${id}`)
};

export default categoryService;