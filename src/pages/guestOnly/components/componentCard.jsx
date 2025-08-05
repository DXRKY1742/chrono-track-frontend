'use client'

// React
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// PrimeReact
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Features
import { loginAsync, registerAsync } from "../../../features/authSlice";

// Components
import { createToastService } from "../../../components/toasts/createToastService";

export function AuthCard({ mode = "login" }) {
  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);
  // Dispatch 
  const dispatch = useDispatch();

  // ----- Theme -----
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const isDark = currentTheme === "arya-blue";

  // States
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Miscelaneous
  const isRegister = mode === "register";
  const navigate = useNavigate();


  // Handlers
   const handleSubmit = async () => {
    if (mode === 'login') {
      if (!identifier || !password) {
        toast.showError('Por favor, completa todos los campos.');
        return;
      }
      const resultAction = await dispatch(loginAsync({ identifier, password }));
      if (loginAsync.fulfilled.match(resultAction)) {
        toast.showSuccess('Inicio de sesión exitoso');
      } else {
        const errorMsg = resultAction.payload?.message || 'Error al iniciar sesión';
        toast.showError(errorMsg);
      }
    } else {
      if (!name || !username || !phone || !email || !password || !confirmPassword) {
        toast.showError('Por favor, completa todos los campos.');
        return;
      }
      if (name.trim().length < 2) {
        toast.showError('El nombre debe tener al menos 2 caracteres.');
        return;
      }
      if (username.trim().length < 2) {
        toast.showError('El nombre de usuario debe tener al menos 2 caracteres.');
        return;
      }
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        toast.showError('Ingresa un número de teléfono válido de 10 dígitos.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.showError('Ingresa un correo electrónico válido.');
        return;
      }
      if (password.length < 6) {
        toast.showError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        toast.showError('Las contraseñas no coinciden.');
        return;
      }
      console.log('Payload enviado al backend:', { name, username, phone, email, password });
      const resultAction = await dispatch(registerAsync({ name, username, phone, email, password }));
      if (registerAsync.fulfilled.match(resultAction)) {
        toast.showSuccess('Registro exitoso!');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.showError('Error al registrar. Intenta de nuevo.');
        console.error('Error al registrar:', resultAction.error?.message);
      }
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toast ref={toastRef} />
      <Card className="w-full sm:w-96 shadow-4 p-5 rounded-xl">
        <div className="flex flex-col gap-4">
          <img
            src={isDark ? "../../../LogoWhite.png" : "../../../LogoBlueOverWhite.png"}
            className="w-40 self-center mt-4"
            alt="Logo"
          />

          <h1 className="self-center">
            {isRegister
              ? "Crea una cuenta en tu agenda inteligente"
              : "Inicia sesión en tu agenda inteligente"}
          </h1>

          {isRegister && (
            <>
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium">
                  Nombre completo
                </label>
                <InputText
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="username" className="block mb-1 text-sm font-medium">
                  Nombre de usuario
                </label>
                <InputText
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu usuario"
                  className="w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                  Teléfono
                </label>
                <InputText
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Tu número"
                  className="w-full rounded"
                />
              </div>
            </>
          )}

          {isRegister ? (
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Correo electrónico
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="identifier" className="block mb-1 text-sm font-medium">
                Correo o usuario
              </label>
              <InputText
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="correo@ejemplo.com o username"
                className="w-full rounded"
              />
            </div>
          )}


          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Contraseña
            </label>
            <InputText
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded"
            />
          </div>

          {isRegister && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm font-medium"
              >
                Confirmar contraseña
              </label>
              <InputText
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="w-full rounded"
              />
            </div>
          )}

          {isRegister ? (
            <div className="flex justify-between text-sm">
              <NavLink
                to="/login"
                className={`${isDark ? "text-white" : "text-[#2979FF]"} hover:underline`}
              >
                Volver al login
              </NavLink>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <NavLink
                to="/register"
                // className="text-blue-600 hover:underline"
                className={`${isDark ? "text-white" : "text-[#2979FF]"} hover:underline`}
              >
                Crear cuenta
              </NavLink>
              {/* <NavLink
                to="/forgot-password"
                // className="text-blue-600 hover:underline"
                className={`${isDark ? "text-white" : "text-[#2979FF]"} hover:underline`}
              >
                ¿Olvidaste tu contraseña?
              </NavLink> */}
            </div>
          )}

          <Button
            label={isRegister ? "Registrarse" : "Ingresar"}
            className={`${isDark ? "bg-gray-900" : "bg-[#2979FF] text-white"} w-40 self-center mt-2 rounded-2xl p-2`}
            onClick={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
}

export default AuthCard;
