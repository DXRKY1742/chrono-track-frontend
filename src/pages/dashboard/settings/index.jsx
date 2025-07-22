import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";

export default function Settings() {
  /* Pending:
        adjust left card height -> smaller
        adjust button styiling
        increment card content margin
        responsive -> flex col on smaller screens 
  */
  const [language, setLanguage] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [emailNotif, setEmailNotif] = useState(false);
  const [deadlineNotif, setDeadlineNotif] = useState(false);
  const [theme, setTheme] = useState("light");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const languages = [
    { name: "Español", code: "es" },
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ajustes</h1>
      <div className="flex gap-6">
        {/* Card Izquierda */}
        <Card className="flex-1 flex flex-col relative" style={{ minHeight: "500px" }}>
          <div className="flex flex-col gap-2 m-2">
            <h1 className="text-xl font-semibold">Username</h1>
            <h5 className="text-gray-600">email@example.com</h5>
          </div>

          <hr className="border-white/30 my-2" />

          <div className="flex flex-col gap-1 m-2">
            <h2 className="text-lg font-semibold mb-2">Información personal</h2>
            <p>Rol: Usuario</p>
            <p>Miembro desde: Enero 2023</p>
            <p>Ubicación: Ciudad de México</p>
          </div>

          <hr className="border-white/30 my-2" />

          <div className="flex flex-col gap-1 m-2">
            <h2 className="text-lg font-semibold mb-2">Preferencias</h2>
            <p>Tema: {theme === "light" ? "Claro" : "Oscuro"}</p>
            <p>Notificaciones: {emailNotif || deadlineNotif ? "Activadas" : "Desactivadas"}</p>
          </div>

          {/* Botones en la esquina inferior derecha */}
          <div className="absolute bottom-4 right-4 flex gap-2 m-2">
            <Button label="Editar perfil" icon="pi pi-user-edit" className="p-button-sm" />
            <Button label="Iniciar sesión" icon="pi pi-sign-in" className="p-button-sm p-button-secondary" />
          </div>
        </Card>

        {/* Card Derecha */}
        <Card className="flex-1 flex flex-col" style={{ minHeight: "500px" }}>
          {/* Selector idioma */}
          <div className="mb-6 m-2">
            <label htmlFor="language" className="block mb-2 font-semibold">Idioma</label>
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

          {/* Slider mostrar consejos */}
          <div className="mb-6 flex items-center gap-4 m-2">
            <label className="font-semibold flex-1">Mostrar consejos y tutoriales</label>
            <Slider
              value={showTips ? 100 : 0}
              onChange={(e) => setShowTips(e.value === 100)}
              step={100}
              min={0}
              max={100}
              style={{ width: "6rem" }}
            />
          </div>

          <hr className="border-white/30 my-2" />

          {/* Notificaciones */}
          <h2 className="mt-4 mb-3 font-semibold m-2">Notificaciones</h2>
          <div className="flex flex-col gap-3 mb-6 m-2">
            <div className="flex items-center gap-3">
              <Slider
                value={emailNotif ? 100 : 0}
                onChange={(e) => setEmailNotif(e.value === 100)}
                step={100}
                min={0}
                max={100}
                style={{ width: "6rem" }}
              />
              <label>Permitir notificaciones por correo</label>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={deadlineNotif ? 100 : 0}
                onChange={(e) => setDeadlineNotif(e.value === 100)}
                step={100}
                min={0}
                max={100}
                style={{ width: "6rem" }}
              />
              <label>Notificarme sobre fechas límite</label>
            </div>
          </div>

          <hr className="border-white/30 my-2" />

          {/* Apariencia */}
          <h2 className="mt-4 mb-3 font-semibold m-2">Apariencia</h2>
          <div className="flex gap-6 mb-6 m-2">
            <div className="flex items-center gap-2">
              <RadioButton
                inputId="light"
                name="theme"
                value="light"
                onChange={(e) => setTheme(e.value)}
                checked={theme === "light"}
              />
              <label htmlFor="light">Tema claro</label>
            </div>
            <div className="flex items-center gap-2 m-2">
              <RadioButton
                inputId="dark"
                name="theme"
                value="dark"
                onChange={(e) => setTheme(e.value)}
                checked={theme === "dark"}
              />
              <label htmlFor="dark">Tema oscuro</label>
            </div>
          </div>

          <hr className="border-white/30 my-2" />

          {/* Seguridad */}
          <h2 className="mt-4 mb-3 font-semibold m-2">Seguridad</h2>
          <div className="flex flex-col gap-4 mb-4 m-2">
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
          <div className="m-2">
            <Button label="Guardar" icon="pi pi-check" />
          </div>
        </Card>
      </div>
    </div>
  );
}
