// src/services/authService.js
import { baseService } from "./baseService";

export async function loginUser({ identifier, password }) {
  return baseService.post('auth/login', { identifier, password });
}

export async function registerUser({ name, username, phone, email, password }) {
  return baseService.post('auth/register', { name, username, phone, email, password });
}
