// src/services/commentService.js
import { baseService } from "./baseService";

const commentService = {
  patchComment: (id, body) => baseService.patch('comments', `${id}`, body),
  deleteComment: (id) => baseService.delete('comments', `${id}`)
};

export default commentService;