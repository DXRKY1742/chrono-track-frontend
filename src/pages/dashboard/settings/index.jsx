// React
import React, { useState } from "react";

// Primereact
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import './settings.css';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../../../features/authSlice'


export default function Settings() {
  // ----- Dispatch ----- 
  const dispatch = useDispatch();
  // ----- Selectors -----
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.theme.currentTheme);
  // ----- Theme -----
  const isDark = theme === "arya-blue";
  const cardBgClass = isDark ? "bg-gray-900" : "bg-gray-200";
  /// ------ States ------
  const [language, setLanguage] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [deadlineNotif, setDeadlineNotif] = useState(true);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const languages = [
    { name: "Español", code: "es" },
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ajustes</h1>
        <div className="flex flex-col lg:flex-row gap-6">
        {/* Card Izquierda */}
        <Card className={`${cardBgClass} flex-1 lg:max-w-md flex flex-col relative rounded-xl shadow-lg border-0" style={{ minHeight: "400px" }}`}>
          <div className="flex items-center gap-3 m-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <i className="pi pi-user text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{user?.name}</h1>
              <h5>{user?.email}</h5>
            </div>
          </div>

          <hr className="my-3 mx-4" />

          <div className="flex flex-col gap-1 m-4">
            <h2 className="text-lg font-semibold mb-2 ">Información personal</h2>
            <p>Usuario: {user?.username}</p>
            <p>Teléfono: {user?.phone}</p>
            <p>
              Miembro desde: {new Date(user?.registerDate).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="">Estado: {user?.isActive ? "Activo" : "Inactivo"}</p>
          </div>
          
          <hr className=" my-3 mx-4" />

          <div className="flex flex-col gap-1 m-4">
            <h2 className="text-lg font-semibold mb-2">Preferencias</h2>
            <p>Tema: {theme === "light" ? "Claro" : "Oscuro"}</p>
            <p>Notificaciones: {emailNotif || deadlineNotif ? "Activadas" : "Desactivadas"}</p>
          </div>

          {/* Botones en la esquina inferior derecha */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              label="Editar perfil" 
              icon="pi pi-user-edit" 
              className="p-button-sm  font-medium px-4 py-2 rounded-lg transition-colors duration-200" 
            />
            <Button 
              label="Cerrar sesión" 
              icon="pi pi-sign-out" 
              className="p-button-sm  font-medium px-4 py-2 rounded-lg transition-colors duration-200" 
              onClick={handleLogout}
            />
          </div>
        </Card>

        {/* Card Derecha */}
        <Card className={`${cardBgClass} flex-1 flex flex-col  rounded-xl shadow-lg border-0" style={{ minHeight: "400px" }}`}>
          {/* Título principal */}
          <div className="m-4 mb-2">
            <h2 className="text-lg font-semibold">Preferencias generales</h2>
          </div>
          
          {/* Selector idioma */}
          <div className="mb-6 m-4 mt-2">
            <label htmlFor="language" className="block mb-2 font-semibol">Idioma</label>
            <Dropdown
              id="language"
              value={language}
              options={languages}
              onChange={(e) => setLanguage(e.value)}
              optionLabel="name"
              placeholder="Selecciona un idioma"
              className="w-full rounded-4"
            />
          </div>

          {/* Switch mostrar consejos */}
          <div className="mb-6 flex items-center justify-between m-4">
            <label className="font-semibold">Mostrar consejos y tutoriales</label>
            <InputSwitch
              checked={showTips}
              onChange={(e) => setShowTips(e.value)}
              className="square-switch"
            />
          </div>

          <hr className=" my-3 mx-4" />

          {/* Notificaciones */}
          <h2 className="mt-4 mb-3 font-semibold m-4">Notificaciones</h2>
          <div className="flex flex-col gap-4 mb-6 m-4">
            <div className="flex items-center justify-between">
              <label className="">Permitir notificaciones por correo</label>
              <InputSwitch
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.value)}
                className="square-switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="">Notificarme sobre fechas límite</label>
              <InputSwitch
                checked={deadlineNotif}
                onChange={(e) => setDeadlineNotif(e.value)}
                className="square-switch"
              />
            </div>
          </div>

          <hr className="my-3 mx-4" />

          {/* Apariencia */}
          <h2 className="mt-4 mb-3 font-semibold m-4">Apariencia</h2>
          <div className="flex gap-6 mb-6 m-4">
            <div className="flex items-center gap-2">
              <RadioButton
                inputId="light"
                name="theme"
                value="saga-blue" 
                onChange={(e) => dispatch({ type: 'theme/set', payload: e.value })}
                checked={theme === 'saga-blue'}
              />
              <label htmlFor="light" className="">Tema claro</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioButton
                inputId="dark"
                name="theme"
                value="arya-blue" 
                onChange={(e) => dispatch({ type: 'theme/set', payload: e.value })}
                checked={theme === 'arya-blue'}
              />
              <label htmlFor="dark" className="">Tema oscuro</label>
            </div>
          </div>

          <hr className=" my-3 mx-4" />

          {/* Seguridad */}
          <h2 className="mt-4 mb-3 font-semibold m-4">Seguridad</h2>
          <div className="flex flex-col gap-4 mb-4 m-4">
            <InputText
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full"
            />
            <InputText
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="m-4">
            <Button 
              label="Guardar" 
              icon="pi pi-check" 
              className="w-full font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            />
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}
