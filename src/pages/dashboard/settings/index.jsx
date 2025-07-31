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
import { useSelector } from "react-redux";


export default function Settings() {
  // ----- Selectors -----
  const user = useSelector((state) => state.auth.user);

  /// ------ States ------
  const [language, setLanguage] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [deadlineNotif, setDeadlineNotif] = useState(true);
  const [theme, setTheme] = useState("light");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const languages = [
    { name: "Español", code: "es" },
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Ajustes</h1>
        <div className="flex flex-col lg:flex-row gap-6">
        {/* Card Izquierda */}
        <Card className="flex-1 lg:max-w-md flex flex-col relative bg-white rounded-xl shadow-lg border-0" style={{ minHeight: "400px" }}>
          <div className="flex items-center gap-3 m-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="pi pi-user text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{user?.name}</h1>
              <h5 className="text-gray-600">{user?.email}</h5>
            </div>
          </div>

          <hr className="border-gray-200 my-3 mx-4" />

          <div className="flex flex-col gap-1 m-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Información personal</h2>
            <p className="text-gray-600">Usuario: {user?.username}</p>
            <p className="text-gray-600">Teléfono: {user?.phone}</p>
            <p className="text-gray-600">
              Miembro desde: {new Date(user?.registerDate).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-600">Estado: {user?.isActive ? "Activo" : "Inactivo"}</p>
          </div>
          
          <hr className="border-gray-200 my-3 mx-4" />

          <div className="flex flex-col gap-1 m-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Preferencias</h2>
            <p className="text-gray-600">Tema: {theme === "light" ? "Claro" : "Oscuro"}</p>
            <p className="text-gray-600">Notificaciones: {emailNotif || deadlineNotif ? "Activadas" : "Desactivadas"}</p>
          </div>

          {/* Botones en la esquina inferior derecha */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              label="Editar perfil" 
              icon="pi pi-user-edit" 
              className="p-button-sm bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200" 
            />
            <Button 
              label="Cerrar sesión" 
              icon="pi pi-sign-out" 
              className="p-button-sm bg-gray-500 hover:bg-gray-600 border-gray-500 hover:border-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200" 
            />
          </div>
        </Card>

        {/* Card Derecha */}
        <Card className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border-0" style={{ minHeight: "400px" }}>
          {/* Título principal */}
          <div className="m-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Preferencias generales</h2>
          </div>
          
          {/* Selector idioma */}
          <div className="mb-6 m-4 mt-2">
            <label htmlFor="language" className="block mb-2 font-semibold text-gray-800">Idioma</label>
            <Dropdown
              id="language"
              value={language}
              options={languages}
              onChange={(e) => setLanguage(e.value)}
              optionLabel="name"
              placeholder="Selecciona un idioma"
              className="w-full"
            />
          </div>

          {/* Switch mostrar consejos */}
          <div className="mb-6 flex items-center justify-between m-4">
            <label className="font-semibold text-gray-800">Mostrar consejos y tutoriales</label>
            <InputSwitch
              checked={showTips}
              onChange={(e) => setShowTips(e.value)}
              className="square-switch"
            />
          </div>

          <hr className="border-gray-200 my-3 mx-4" />

          {/* Notificaciones */}
          <h2 className="mt-4 mb-3 font-semibold m-4 text-gray-800">Notificaciones</h2>
          <div className="flex flex-col gap-4 mb-6 m-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-600">Permitir notificaciones por correo</label>
              <InputSwitch
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.value)}
                className="square-switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-600">Notificarme sobre fechas límite</label>
              <InputSwitch
                checked={deadlineNotif}
                onChange={(e) => setDeadlineNotif(e.value)}
                className="square-switch"
              />
            </div>
          </div>

          <hr className="border-gray-200 my-3 mx-4" />

          {/* Apariencia */}
          <h2 className="mt-4 mb-3 font-semibold m-4 text-gray-800">Apariencia</h2>
          <div className="flex gap-6 mb-6 m-4">
            <div className="flex items-center gap-2">
              <RadioButton
                inputId="light"
                name="theme"
                value="light"
                onChange={(e) => setTheme(e.value)}
                checked={theme === "light"}
              />
              <label htmlFor="light" className="text-gray-600">Tema claro</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioButton
                inputId="dark"
                name="theme"
                value="dark"
                onChange={(e) => setTheme(e.value)}
                checked={theme === "dark"}
              />
              <label htmlFor="dark" className="text-gray-600">Tema oscuro</label>
            </div>
          </div>

          <hr className="border-gray-200 my-3 mx-4" />

          {/* Seguridad */}
          <h2 className="mt-4 mb-3 font-semibold m-4 text-gray-800">Seguridad</h2>
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
              className="w-full bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            />
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}
