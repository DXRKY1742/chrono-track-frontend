'use client'

// React
import { useState } from "react";
import { NavLink } from "react-router-dom";

// PrimeReact
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export function AuthCard({ mode = "login" }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isRegister = mode === "register";

  const handleSubmit = () => {
    if (isRegister) {
      // lógica registro
      console.log("Register data:", { name, email, password, confirmPassword });
    } else {
      // lógica login
      console.log("Login data:", { email, password });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full sm:w-96 shadow-4 p-5 rounded-xl">
        <div className="flex flex-col gap-4">
          <img
            src="../../../LogoBlueOverWhite.png"
            className="w-40 self-center mt-4"
            alt="Logo"
          />
          <h1 className="self-center">
            {isRegister
              ? "Crea una cuenta en tu agenda inteligente"
              : "Inicia sesión en tu agenda inteligente"}
          </h1>

          {isRegister && (
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
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Correo electrónico
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@chronotrack.com"
              className="w-full rounded"
            />
          </div>

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
                className="text-blue-600 hover:underline"
              >
                Volver al login
              </NavLink>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <NavLink
                to="/register"
                className="text-blue-600 hover:underline"
              >
                Crear cuenta
              </NavLink>
              <NavLink
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </NavLink>
            </div>
          )}

          <Button
            label={isRegister ? "Registrarse" : "Ingresar"}
            className="w-40 self-center mt-2 bg-blue-600 text-white rounded-2xl p-2"
            onClick={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
}

export default AuthCard;
