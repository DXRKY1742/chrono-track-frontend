// src/services/authService.js
import { baseService } from "./baseService";

export async function loginUser({ email, password }) {
  return baseService.post('auth/login', { email, password });
}

export async function registerUser({ name, username, phone, email, password }) {
  return baseService.post('auth/register', { name, username, phone, email, password });
}
