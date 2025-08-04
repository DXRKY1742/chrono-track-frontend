'use client'

// React
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// PrimeReact
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Features
import { loginAsync, registerAsync } from "../../../features/authSlice";

export function AuthCard({ mode = "login" }) {
  // Dispatch 
  const dispatch = useDispatch();

  // ----- Theme -----
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const isDark = currentTheme === "arya-blue";

  // Selectors
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);

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
      console.log('Attemting login')
      dispatch(loginAsync({ identifier, password }));
    } else {
      console.log('Attempting register')
      const resultAction = await dispatch(registerAsync({ name, username, phone, email, password }));
      if (registerAsync.fulfilled.match(resultAction)) {
        console.log('Registro exitoso, redirigiendo al login...');
        navigate('/login');
      } else {
        console.error('Error al registrar:', resultAction.error?.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
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
              <NavLink
                to="/forgot-password"
                // className="text-blue-600 hover:underline"
                className={`${isDark ? "text-white" : "text-[#2979FF]"} hover:underline`}
              >
                ¿Olvidaste tu contraseña?
              </NavLink>
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
